export const meta = {
  name: 'implement-issue-pipeline',
  description:
    'THE issue-implementation pipeline (single encoding): explore → build → wire PR → review → device QA → bounded auto-fix → run metrics. Gate-free — any clarify/grill conversation happens in the /implement-issue skill BEFORE this launches. Approval happens at PR review before merge.',
  whenToUse:
    'Launched by the /implement-issue skill after its interactive judgment, or invoked directly (headless/batch) on a crisp, pre-approved issue. For uncertain issues run /implement-issue instead — it grills first, then delegates here.',
  phases: [
    { title: 'Explore', detail: 'explorer maps the issue onto the architecture (default on)' },
    { title: 'Build', detail: 'feature-builder implements + opens PR' },
    { title: 'Wire PR', detail: 'assign PR + add to project (metadata only, best-effort)' },
    { title: 'Review', detail: 'code-reviewer checks the diff against the rules (parallel with QA)' },
    { title: 'QA', detail: 'qa-engineer drives the app on the agent-device (default on, parallel with Review)' },
    { title: 'Fix', detail: 'feature-builder addresses blocking findings' },
    { title: 'Report', detail: 'post a best-effort run-metrics PR comment' },
  ],
}

// Loop cap: the single place to change the auto-fix round limit (currently 1)
const DEFAULT_MAX_FIX_ROUNDS = 1

// ── Args contract ─────────────────────────────────────────────────────────────
// This workflow owns the CANONICAL defaults; callers (the /implement-issue skill,
// or a direct batch invocation) pass ONLY what the user overrode.
//   issue           (required) GitHub issue number
//   explore         default ON  — pass false to skip the exploration phase
//   explorerReport  optional pre-supplied exploration report (skips the phase)
//   clarifications  optional clarifications text — fallback channel for when the
//                   skill did NOT fold answers into the issue body
//   review          default ON  — pass false to skip static code review
//   qa              default ON  — pass false to skip device QA
//   worktree        default OFF — pass true to isolate code-touching agents
//   maxFix          default DEFAULT_MAX_FIX_ROUNDS
const opts = typeof args === 'object' && args !== null ? args : { issue: args }
const issue = opts.issue
if (!issue) throw new Error('implement-issue-pipeline: missing `issue` in args, e.g. { issue: 378 }')

const suppliedReport =
  typeof opts.explorerReport === 'string' && opts.explorerReport.trim() ? opts.explorerReport : null
const clarifications =
  typeof opts.clarifications === 'string' && opts.clarifications.trim() ? opts.clarifications : null
const doExplore = opts.explore !== false && !suppliedReport
const doReview = opts.review !== false // default on
const doQa = opts.qa !== false // default on
const worktree = opts.worktree === true // default off — opt-in isolation
const MAX_FIX = typeof opts.maxFix === 'number' ? opts.maxFix : DEFAULT_MAX_FIX_ROUNDS // hard counter; change DEFAULT_MAX_FIX_ROUNDS above to adjust the cap
const iso = worktree ? { isolation: 'worktree' } : {}

const MODEL_BY_AGENT = {
  explorer: 'sonnet',
  'feature-builder': 'opus',
  'code-reviewer': 'opus',
  'qa-engineer': 'sonnet',
}
const metrics = []
const seenLabels = {}

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

function recordMetric(label, agentType, tokens) {
  seenLabels[label] = (seenLabels[label] || 0) + 1
  const n = seenLabels[label]
  metrics.push({
    agent: n > 1 ? `${label} (#${n})` : label,
    model: agentType ? MODEL_BY_AGENT[agentType] || 'n/a' : 'n/a',
    codegraph: 'n/a',
    time: 'n/a',
    tokens,
  })
}

async function trackedAgent(prompt, agentOpts) {
  const before = spent()
  const result = await agent(prompt, agentOpts)
  recordMetric(agentOpts.label, agentOpts.agentType, tokenDelta(before, spent()))
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

const EXPLORE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    report: { type: 'string' },
  },
  required: ['report'],
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

const clarificationsBlock = clarifications
  ? `\n\nClarifications from the pre-build conversation (authoritative additions to the issue's Description):\n${clarifications}`
  : ''

const explorePrompt = `Run pre-implementation exploration for GitHub issue #${issue} per your process: map the issue onto the architecture (target feature and dependency tier, files/layers to touch, closest pattern to mirror, integration points, risks, suggested approach). Return the full structured exploration report as the \`report\` string.${clarificationsBlock}`

// ── Explore (phase 0, default on) ─────────────────────────────────────────────
let explorerReport = suppliedReport
if (doExplore) {
  phase('Explore')
  try {
    const ex = await trackedAgent(explorePrompt, { agentType: 'explorer', label: `explore:${issue}`, schema: EXPLORE_SCHEMA })
    explorerReport = ex && ex.report ? ex.report : null
    if (!explorerReport) log('Explorer returned no report — builder will map the codebase itself (non-blocking)')
  } catch (e) {
    log(`Explore phase failed (non-blocking): ${e && e.message ? e.message : e}`)
  }
}

const explorerBlock = explorerReport
  ? `\n\nExploration report (use it as your codebase map; don't re-explore from scratch):\n${explorerReport}`
  : ''

const buildPrompt = `Implement GitHub issue #${issue} for HolidAI, following your full process: read the issue, obey the architecture rules, verify with tsc + arch (once, before the commit sequence), create branch feature/${issue}, commit in small layer-aligned commits, open the PR with an empty body, and post your report as the first PR comment. Return the PR URL and a one-line summary.${clarificationsBlock}${explorerBlock}`

const reviewPrompt = `Review the change on branch feature/${issue} (issue #${issue}) per your process, and post your review comment on the PR. Return your overall verdict (PASS or CHANGES-REQUESTED) and the list of blocking findings (empty if none).`

const qaPrompt = `Run device QA for issue #${issue} on branch feature/${issue} via agent-device per your process (baseline checks + acceptance criteria), and post your QA comment on the PR. Return the overall verdict (PASS, FAIL, or NOT_PERFORMED) and the list of blocking findings.`

const fixPrompt = findings =>
  `Fix mode for issue #${issue}. Branch feature/${issue} and its PR already exist — do NOT create a new branch or PR. Address these blocking findings as new commits on the existing branch, then return the PR URL and a one-line summary of the fixes:\n${findings
    .map((f, i) => `${i + 1}. ${f}`)
    .join('\n')}`

async function verify() {
  if (!doReview && !doQa) return { review: null, qa: null }
  // Review ∥ QA: the two verify stages are independent — code-reviewer reads committed
  // refs via `git diff` (never the working tree), qa-engineer owns the device/checkout —
  // so they run in parallel: wall-clock = max(review, qa) instead of review + qa.
  // Per-agent `phase` opts (not the global phase()) keep the progress groups race-free.
  const before = spent()
  const kinds = []
  const thunks = []
  if (doReview) {
    kinds.push('review')
    thunks.push(() => agent(reviewPrompt, { agentType: 'code-reviewer', label: `review:${issue}`, phase: 'Review', schema: REVIEW_SCHEMA }))
  }
  if (doQa) {
    kinds.push('qa')
    thunks.push(() => agent(qaPrompt, { agentType: 'qa-engineer', label: `qa:${issue}`, phase: 'QA', schema: QA_SCHEMA, ...iso }))
  }
  const results = await parallel(thunks)
  const delta = tokenDelta(before, spent())

  const byKind = {}
  kinds.forEach((k, i) => {
    byKind[k] = results[i]
  })
  // parallel() resolves a failed/skipped agent to null instead of throwing — fail loudly
  // here rather than letting a missing verdict read as "nothing blocking" downstream.
  if (doReview && !byKind.review) throw new Error(`code-reviewer returned no result for issue #${issue}`)
  if (doQa && !byKind.qa) throw new Error(`qa-engineer returned no result for issue #${issue}`)

  // Concurrent budget deltas overlap, so per-agent tokens can't be attributed when both
  // stages ran — record one combined metrics row (single-stage runs keep exact attribution).
  if (kinds.length === 1) {
    recordMetric(`${kinds[0]}:${issue}`, kinds[0] === 'review' ? 'code-reviewer' : 'qa-engineer', delta)
  } else {
    recordMetric(`verify:${issue} (review ∥ qa)`, null, delta)
  }

  return { review: byKind.review || null, qa: byKind.qa || null }
}

function blockingFrom(review, qa) {
  const r = review && review.verdict === 'CHANGES-REQUESTED' ? review.blockingFindings : []
  const q = qa && qa.verdict === 'FAIL' ? qa.blockingFindings : []
  return [...r, ...q]
}

phase('Build')
const build = await trackedAgent(buildPrompt, { agentType: 'feature-builder', label: `build:${issue}`, schema: BUILD_SCHEMA, ...iso })
log(`Built issue #${issue} → ${build.prUrl}`)

const wirePrompt = `PR wiring for the pull request ${build.prUrl}. Change METADATA ONLY — never edit the PR body or title (those are owned by the setup-pr workflow), and do not add issue-linking. Do exactly two things with the \`gh\` CLI:
1. Assign the PR to timothyrusso: \`gh pr edit ${build.prUrl} --add-assignee timothyrusso\`.
2. Add the PR to GitHub Project #1: \`gh project item-add 1 --owner timothyrusso --url ${build.prUrl}\`. This needs the \`project\` scope on the gh token, which is currently MISSING. If step 2 fails with a scope/authorization error, do NOT abort and do NOT undo step 1 — print the exact remediation \`gh auth refresh -s project\` and treat the run as fine. Step 1 must still stand.
Report which of the two steps succeeded and whether the remediation was needed.`
try {
  phase('Wire PR')
  // Mechanical gh commands — low effort is enough and cheaper/faster.
  await agent(wirePrompt, { agentType: 'general-purpose', label: `wire:${issue}`, effort: 'low' })
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

try {
  const report = buildMetricsReport()
  phase('Report')
  const reportPrompt = `Post the run-metrics report below as a NEW comment on the pull request ${build.prUrl}. Do NOT edit the PR body, the PR title, or any existing comment — this must be an additional, standalone comment. Write everything between the <<<REPORT and REPORT>>> markers (excluding the markers themselves) VERBATIM — no edits, no summarising, no extra text — to a temp file, then run \`gh pr comment ${build.prUrl} --body-file <that-file>\`.

<<<REPORT
${report}
REPORT>>>`
  // Verbatim posting of pre-built markdown — low effort is enough and cheaper/faster.
  await agent(reportPrompt, { agentType: 'general-purpose', label: `report:${issue}`, effort: 'low' })
} catch (e) {
  log(`Metrics-report step failed (non-blocking): ${e && e.message ? e.message : e}`)
}

return {
  prUrl: build.prUrl,
  explored: Boolean(explorerReport),
  reviewVerdict: doReview ? review.verdict : 'skipped',
  qaVerdict: doQa ? qa.verdict : 'skipped',
  fixAttempts,
  passed: outstanding.length === 0,
  outstanding,
}
