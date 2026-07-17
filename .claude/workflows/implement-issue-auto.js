export const meta = {
  name: 'implement-issue-auto',
  description:
    'Unattended, deterministic version of /implement-issue: build → review → (optional) device QA → bounded auto-fix. No clarify/approve gates — assumes a complete, pre-approved issue (author it with the write-issue skill). Approval happens at PR review before merge.',
  whenToUse:
    'A crisp, well-specified GitHub feature issue that needs implementing without human-in-the-loop gates (batch/CI/overnight). For uncertain or exploratory issues use the interactive /implement-issue skill instead.',
  phases: [
    { title: 'Build', detail: 'feature-builder implements + opens PR' },
    { title: 'Wire PR', detail: 'assign PR + add to project (metadata only, best-effort)' },
    { title: 'Review', detail: 'code-reviewer checks the diff against the rules' },
    { title: 'QA', detail: 'qa-engineer drives the app on the agent-device (opt-in)' },
    { title: 'Fix', detail: 'feature-builder addresses blocking findings' },
    { title: 'Report', detail: 'post a best-effort run-metrics PR comment' },
  ],
}

// Loop cap: the single place to change the auto-fix round limit (currently 1)
const DEFAULT_MAX_FIX_ROUNDS = 1

const opts = typeof args === 'object' && args !== null ? args : { issue: args }
const issue = opts.issue
if (!issue) throw new Error('implement-issue-auto: missing `issue` in args, e.g. { issue: 378 }')

const doReview = opts.review !== false // default on
const doQa = opts.qa === true // opt-in — off by default
const worktree = opts.worktree === true
const MAX_FIX = typeof opts.maxFix === 'number' ? opts.maxFix : DEFAULT_MAX_FIX_ROUNDS // hard counter; change DEFAULT_MAX_FIX_ROUNDS above to adjust the cap
const iso = worktree ? { isolation: 'worktree' } : {}

// --- Run metrics (best-effort) ---------------------------------------------
// Per-agent metrics for the final PR-comment report. Every value degrades to `n/a`: a
// missing or odd runtime signal is reported as `n/a`, never thrown — metrics never fail the run.
const MODEL_BY_AGENT = {
  'feature-builder': 'opus',
  'code-reviewer': 'opus',
  'qa-engineer': 'sonnet',
}
const metrics = [] // one row per tracked agent() run, in execution order
const seenLabels = {} // disambiguate repeated roles (re-review, re-QA, fix rounds)

// budget.spent() is the only token signal the runtime exposes; snapshotting it before/after
// each agent() call yields per-agent deltas. Wall-clock time is NOT available (scripts cannot
// call Date.now()), so it is always reported as `n/a` rather than fabricated.
function spent() {
  try {
    if (typeof budget === 'undefined' || !budget || typeof budget.spent !== 'function') return null
    return budget.spent()
  } catch {
    return null
  }
}
function asTokens(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (v && typeof v === 'object') {
    const n = v.tokens ?? v.total ?? v.totalTokens ?? null
    return typeof n === 'number' && Number.isFinite(n) ? n : null
  }
  return null
}
function tokenDelta(before, after) {
  const b = asTokens(before)
  const a = asTokens(after)
  if (b == null || a == null) return 'n/a'
  const d = a - b
  return Number.isFinite(d) && d >= 0 ? d : 'n/a'
}
// Wrap agent() so every tracked run records model / codegraph / time / tokens for the report.
async function trackedAgent(prompt, agentOpts) {
  const before = spent()
  const result = await agent(prompt, agentOpts)
  const label = agentOpts.label
  seenLabels[label] = (seenLabels[label] || 0) + 1
  const n = seenLabels[label]
  metrics.push({
    agent: n > 1 ? `${label} (#${n})` : label,
    model: MODEL_BY_AGENT[agentOpts.agentType] || 'n/a',
    codegraph: 'n/a', // real usage isn't observable from the workflow runtime
    time: 'n/a', // scripts can't read the clock (no Date.now())
    tokens: tokenDelta(before, spent()),
  })
  return result
}
const runStartSpent = spent()

function fmtTokens(t) {
  return typeof t === 'number' ? String(t) : t
}
function buildMetricsReport() {
  let totalTok = tokenDelta(runStartSpent, spent())
  if (totalTok === 'n/a') {
    const nums = metrics.map(m => m.tokens).filter(t => typeof t === 'number')
    totalTok = nums.length ? nums.reduce((a, b) => a + b, 0) : 'n/a'
  }
  const rows = metrics.map(m => `| ${m.agent} | ${m.model} | ${m.codegraph} | ${m.time} | ${fmtTokens(m.tokens)} |`).join('\n')
  return [
    `## 🤖 Automated run metrics — issue #${issue}`,
    '',
    '_Best-effort: any metric the workflow runtime cannot reliably capture is shown as `n/a` and never blocks the run._',
    '',
    '| Agent | Model | Codegraph | Wall-clock | Tokens |',
    '| --- | --- | --- | --- | --- |',
    rows,
    '',
    `**Totals** — wall-clock: \`n/a\` · tokens: ${fmtTokens(totalTok)}`,
    '',
    '<sub>Wall-clock time is `n/a` because workflow scripts cannot read the clock (`Date.now()` is unavailable). Codegraph usage is not observable from the runtime, so it is `n/a`. Tokens are per-agent `budget.spent()` deltas; the total is the whole-run delta.</sub>',
  ].join('\n')
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    prUrl: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['prUrl', 'summary'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { enum: ['PASS', 'CHANGES-REQUESTED'] },
    blockingFindings: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'blockingFindings'],
}

const QA_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { enum: ['PASS', 'FAIL', 'NOT_PERFORMED'] },
    blockingFindings: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'blockingFindings'],
}

const buildPrompt = `Implement GitHub issue #${issue} for HolidAI, following your full process: read the issue, obey the architecture rules, verify with tsc + arch, create branch feature/${issue}, commit in small layer-aligned commits, open the PR with an empty body, and post your report as the first PR comment. Return the PR URL and a one-line summary.`

const reviewPrompt = `Review the change on branch feature/${issue} (issue #${issue}) per your process, and post your review comment on the PR. Return your overall verdict (PASS or CHANGES-REQUESTED) and the list of blocking findings (empty if none).`

const qaPrompt = `Run device QA for issue #${issue} on branch feature/${issue} via agent-device per your process (baseline checks + acceptance criteria), and post your QA comment on the PR. Return the overall verdict (PASS, FAIL, or NOT_PERFORMED) and the list of blocking findings.`

const fixPrompt = findings =>
  `Fix mode for issue #${issue}. Branch feature/${issue} and its PR already exist — do NOT create a new branch or PR. Address these blocking findings as new commits on the existing branch, then return the PR URL and a one-line summary of the fixes:\n${findings
    .map((f, i) => `${i + 1}. ${f}`)
    .join('\n')}`

async function verify() {
  let review = null
  let qa = null
  if (doReview) {
    phase('Review')
    review = await trackedAgent(reviewPrompt, { agentType: 'code-reviewer', label: `review:${issue}`, schema: REVIEW_SCHEMA })
  }
  if (doQa) {
    phase('QA')
    qa = await trackedAgent(qaPrompt, { agentType: 'qa-engineer', label: `qa:${issue}`, schema: QA_SCHEMA, ...iso })
  }
  return { review, qa }
}

function blockingFrom(review, qa) {
  const r = review && review.verdict === 'CHANGES-REQUESTED' ? review.blockingFindings : []
  const q = qa && qa.verdict === 'FAIL' ? qa.blockingFindings : []
  return [...r, ...q]
}

phase('Build')
const build = await trackedAgent(buildPrompt, { agentType: 'feature-builder', label: `build:${issue}`, schema: BUILD_SCHEMA, ...iso })
log(`Built issue #${issue} → ${build.prUrl}`)

// PR wiring — metadata only (assignee + project). Never touches the PR body/title (owned by
// .github/workflows/setup-pr.yml). Best-effort: the project-add step needs the `project` token
// scope, which may be missing — it degrades to a logged remediation and never aborts the run.
const wirePrompt = `PR wiring for the pull request ${build.prUrl}. Change METADATA ONLY — never edit the PR body or title (those are owned by the setup-pr workflow), and do not add issue-linking. Do exactly two things with the \`gh\` CLI:
1. Assign the PR to timothyrusso: \`gh pr edit ${build.prUrl} --add-assignee timothyrusso\`.
2. Add the PR to GitHub Project #1: \`gh project item-add 1 --owner timothyrusso --url ${build.prUrl}\`. This needs the \`project\` scope on the gh token, which is currently MISSING. If step 2 fails with a scope/authorization error, do NOT abort and do NOT undo step 1 — print the exact remediation \`gh auth refresh -s project\` and treat the run as fine. Step 1 must still stand.
Report which of the two steps succeeded and whether the remediation was needed.`
try {
  phase('Wire PR')
  await agent(wirePrompt, { agentType: 'general-purpose', label: `wire:${issue}` })
} catch (e) {
  log(`PR wiring step failed (non-blocking): ${e && e.message ? e.message : e}`)
}

let { review, qa } = await verify()
let fixAttempts = 0

while (blockingFrom(review, qa).length > 0 && fixAttempts < MAX_FIX) {
  fixAttempts++
  const findings = blockingFrom(review, qa)
  log(`Fix attempt ${fixAttempts}/${MAX_FIX} — ${findings.length} blocking finding(s)`)
  phase('Fix')
  await trackedAgent(fixPrompt(findings), { agentType: 'feature-builder', label: `fix:${issue}#${fixAttempts}`, schema: BUILD_SCHEMA, ...iso })
  ;({ review, qa } = await verify())
}

const outstanding = blockingFrom(review, qa)

// Final metrics report — posted as a NEW PR comment (never the PR body, which setup-pr.yml owns).
// The workflow script has no Bash, so an agent() step runs `gh pr comment`. Best-effort: if
// anything here fails it is logged and swallowed, never aborting the run.
try {
  const report = buildMetricsReport()
  phase('Report')
  const reportPrompt = `Post the run-metrics report below as a NEW comment on the pull request ${build.prUrl}. Do NOT edit the PR body, the PR title, or any existing comment — this must be an additional, standalone comment. Write everything between the <<<REPORT and REPORT>>> markers (excluding the markers themselves) VERBATIM — no edits, no summarising, no extra text — to a temp file, then run \`gh pr comment ${build.prUrl} --body-file <that-file>\`.

<<<REPORT
${report}
REPORT>>>`
  await agent(reportPrompt, { agentType: 'general-purpose', label: `report:${issue}` })
} catch (e) {
  log(`Metrics-report step failed (non-blocking): ${e && e.message ? e.message : e}`)
}

return {
  prUrl: build.prUrl,
  reviewVerdict: doReview ? review.verdict : 'skipped',
  qaVerdict: doQa ? qa.verdict : 'skipped',
  fixAttempts,
  passed: outstanding.length === 0,
  outstanding,
}
