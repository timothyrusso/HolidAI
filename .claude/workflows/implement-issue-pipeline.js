export const meta = {
  name: 'implement-issue-pipeline',
  description:
    'THE issue-implementation pipeline (single encoding): explore → build → wire PR → review ∥ device QA → finding vetting → bounded auto-fix → run metrics. Gate-free — any clarify/grill conversation happens in the /implement-issue skill BEFORE this launches. Approval happens at PR review before merge.',
  whenToUse:
    'Launched by the /implement-issue skill after its interactive judgment, or invoked directly (headless/batch) on a crisp, pre-approved issue. For uncertain issues run /implement-issue instead — it grills first, then delegates here.',
  phases: [
    { title: 'Explore', detail: 'explorer maps the issue onto the architecture (default on)' },
    { title: 'Build', detail: 'feature-builder implements + opens PR' },
    { title: 'Wire PR', detail: 'assign PR + add to project (metadata only, best-effort)' },
    { title: 'Review', detail: 'code-reviewer checks the diff against the rules (parallel with QA)' },
    { title: 'QA', detail: 'qa-engineer drives the app on the agent-device (default on, parallel with Review)' },
    { title: 'Vet', detail: 'one skeptic per blocking finding tries to refute it before it can trigger a fix' },
    { title: 'Fix', detail: 'feature-builder addresses confirmed findings (history-aware, stops early if stuck)' },
    { title: 'Report', detail: 'post a best-effort run-metrics PR comment' },
  ],
}

// Loop cap: the single place to change the auto-fix round limit (currently 2).
// Convergence detection in the fix loop stops earlier when a round reproduces a
// previously-seen findings-set, so raising this only buys rounds that make progress.
const DEFAULT_MAX_FIX_ROUNDS = 2

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
  'finding-vetter': 'opus',
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

// Per-criterion QA results (traceability): the qa-engineer already judges per test item
// (T01, T02, …) in its PR comment — this schema surfaces that detail instead of collapsing
// it to one self-reported verdict. The OVERALL verdict is derived in code (qaVerdictFrom),
// so "PASS" provably means "every item passed", not "the agent says pass".
const QA_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          criterion: { type: 'string' },
          class: { enum: ['flow', 'edge', 'ux'] },
          verdict: { enum: ['PASS', 'FAIL', 'BLOCKED', 'NEEDS-REVIEW'] },
          note: { type: 'string' },
        },
        required: ['id', 'criterion', 'class', 'verdict', 'note'],
      },
    },
    baseline: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          check: { type: 'string' },
          pass: { type: 'boolean' },
        },
        required: ['check', 'pass'],
      },
    },
    blockingFindings: { type: 'array', items: { type: 'string' } },
    notPerformedReason: { type: 'string' },
  },
  required: ['items', 'baseline', 'blockingFindings'],
}

// Skeptic verdict for one blocking finding (adversarial vetting before the fix loop).
const VET_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { enum: ['confirmed', 'refuted', 'suspect'] },
    reason: { type: 'string' },
  },
  required: ['verdict', 'reason'],
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

const qaPrompt = `Run device QA for issue #${issue} on branch feature/${issue} via agent-device per your process (baseline checks + acceptance criteria), and post your QA comment on the PR. Return the structured result mirroring your report: items[] (one entry per test item — id, the acceptance criterion it verifies verbatim, class, per-item verdict, one-line note with evidence path on FAIL), baseline[] ({check, pass} per baseline check), blockingFindings (empty if none), and notPerformedReason ONLY if the app could not be run. Do NOT compute an overall verdict — the pipeline derives it from the items. Every acceptance criterion must appear in items; if one could not be exercised, report it as BLOCKED with the reason.`

// History-aware fix prompt (e2): findings that survived a previous attempt are marked
// [PERSISTS] and the builder is told what was already tried — round N is an escalation
// with new information, not a reroll of round N−1.
const fixPrompt = (findings, attempt, history, persistedKeys) =>
  `Fix mode for issue #${issue} (attempt ${attempt}/${MAX_FIX}). Branch feature/${issue} and its PR already exist — do NOT create a new branch or PR. Address these CONFIRMED blocking findings as new commits on the existing branch, then return the PR URL and a one-line summary of the fixes:\n${findings
    .map((f, i) => `${i + 1}. [${f.source}]${persistedKeys.has(findingKey(f)) ? ' [PERSISTS — a previous fix attempt did NOT clear this]' : ''} ${f.text}`)
    .join('\n')}${
    history.length > 0
      ? `\n\nPrevious fix attempts in this run:\n${history
          .map(h => `- Attempt ${h.round}: "${h.summary}"`)
          .join('\n')}\nFindings marked [PERSISTS] survived those attempts — the tried approach is wrong for them. Do NOT repeat it: re-diagnose from scratch (read the code around your previous fix commits, check the adjacent layer, question the assumed root cause) and take a different angle.`
      : ''
  }`

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

// Overall QA verdict, derived in code from the per-item results — never self-reported.
function qaVerdictFrom(qa) {
  if (!qa) return null
  if (qa.notPerformedReason) return 'NOT_PERFORMED'
  // Ran but produced no per-criterion results: QA did not do its job — treat as not
  // performed (non-blocking, surfaced) rather than a silent pass.
  if (qa.items.length === 0) return 'NOT_PERFORMED'
  const baselineFailed = qa.baseline.some(b => !b.pass)
  const itemFailed = qa.items.some(i => i.verdict === 'FAIL')
  return baselineFailed || itemFailed || qa.blockingFindings.length > 0 ? 'FAIL' : 'PASS'
}

// e1 — convergence fingerprinting. QA findings carry stable T-ids (per-criterion schema),
// so key on those; review findings have no stable id — fall back to normalized text, which
// catches literal repeats but can miss re-worded drift (accepted limitation; a semantic
// same-defect judge is the upgrade if drift shows up in real runs).
function findingKey(f) {
  const tid = f.source === 'qa' ? (f.text.match(/\bT\d{2,}\b/) || [])[0] : null
  return tid ? `qa:${tid}` : `${f.source}:${f.text.toLowerCase().replace(/\s+/g, ' ').trim()}`
}
function roundFingerprint(findings) {
  return findings.map(findingKey).sort().join('\n')
}

// Blocking findings tagged with provenance (review vs qa) — the vetter and the fix prompt
// both need to know where a claim came from.
function blockingFrom(review, qa) {
  const out = []
  if (review && review.verdict === 'CHANGES-REQUESTED') {
    for (const f of review.blockingFindings) out.push({ text: f, source: 'review' })
  }
  if (qa && qaVerdictFrom(qa) === 'FAIL') {
    if (qa.blockingFindings.length > 0) {
      for (const f of qa.blockingFindings) out.push({ text: f, source: 'qa' })
    } else {
      // Agent inconsistency guard: items FAILed but no findings listed — synthesize them
      // from the failed items so a FAIL verdict can never arrive with nothing to fix.
      for (const i of qa.items.filter(i => i.verdict === 'FAIL')) {
        out.push({ text: `${i.id} (${i.criterion}): ${i.note}`, source: 'qa' })
      }
    }
  }
  return out
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

// ── Vet: adversarial check of every blocking finding before it can trigger a fix ─────
// A false finding sent to fix mode makes the builder "fix" correct code (known real case:
// device QA misreading layered-Animated buttons as non-hittable). One skeptic per finding
// tries to REFUTE it; only confirmed findings reach the builder. Device-runtime claims the
// skeptic can't check from code + captured evidence become `suspect` — surfaced for human
// eyes, never auto-fixed. Fail-safe: a dead vetter confirms (status quo), never drops.
const vetPrompt = f =>
  `Adversarially verify ONE ${f.source === 'qa' ? 'device-QA' : 'code-review'} finding for issue #${issue} (branch feature/${issue}, PR ${build.prUrl}) per your process. The finding:\n\n"${f.text}"\n\nTry to refute it against the actual diff, code, and captured QA evidence. Return confirmed, refuted, or suspect with your reason.`

async function vetFindings(findings) {
  if (findings.length === 0) return { confirmed: [], refuted: [], suspect: [] }
  const before = spent()
  const results = await parallel(
    findings.map((f, i) => () =>
      agent(vetPrompt(f), { agentType: 'finding-vetter', label: `vet:${issue}#${i + 1}`, phase: 'Vet', schema: VET_SCHEMA })),
  )
  const delta = tokenDelta(before, spent())
  recordMetric(findings.length === 1 ? `vet:${issue}` : `vet:${issue} (x${findings.length})`, 'finding-vetter', delta)

  const out = { confirmed: [], refuted: [], suspect: [] }
  findings.forEach((f, i) => {
    const v = results[i]
    const verdict = v && v.verdict ? v.verdict : 'confirmed' // fail-safe: never silently drop a finding
    out[verdict].push({ ...f, vetReason: v && v.reason ? v.reason : 'vetter unavailable — kept (fail-safe)' })
  })
  if (out.refuted.length > 0) log(`Vet: refuted ${out.refuted.length} finding(s) — excluded from fix`)
  if (out.suspect.length > 0) log(`Vet: ${out.suspect.length} suspect device claim(s) — need human eyes, not auto-fixed`)
  return out
}

let { review, qa } = await verify()
let vetted = await vetFindings(blockingFrom(review, qa))
let fixAttempts = 0
let stuck = false
const seenRounds = new Set() // fingerprint of every findings-set already fixed against (e1)
const fixHistory = [] // { round, summary } — feeds later fix prompts (e2)
let prevKeys = new Set() // last round's finding keys, for [PERSISTS] annotations

while (vetted.confirmed.length > 0 && fixAttempts < MAX_FIX) {
  // e1 — convergence stop: if this exact findings-set already triggered a fix round,
  // another round would be a reroll — and every round costs a full re-verify (device QA,
  // the slowest stage). The Set covers all prior rounds, so A→B→A cycles are caught too.
  const fp = roundFingerprint(vetted.confirmed)
  if (seenRounds.has(fp)) {
    stuck = true
    log(`Convergence: findings identical to a previous round — stopping early (stuck) instead of spending fix round ${fixAttempts + 1}/${MAX_FIX}`)
    break
  }
  seenRounds.add(fp)

  fixAttempts++
  log(`Fix attempt ${fixAttempts}/${MAX_FIX} — ${vetted.confirmed.length} confirmed blocking finding(s)`)
  phase('Fix')
  const fix = await trackedAgent(fixPrompt(vetted.confirmed, fixAttempts, fixHistory, prevKeys), { agentType: 'feature-builder', label: `fix:${issue}#${fixAttempts}`, schema: BUILD_SCHEMA, ...iso })
  fixHistory.push({ round: fixAttempts, summary: fix && fix.summary ? fix.summary : 'n/a' })
  prevKeys = new Set(vetted.confirmed.map(findingKey))
  ;({ review, qa } = await verify())
  vetted = await vetFindings(blockingFrom(review, qa))
}

const outstanding = vetted.confirmed

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
  qaVerdict: doQa ? qaVerdictFrom(qa) : 'skipped',
  qaItems: doQa && qa ? qa.items : [],
  fixAttempts,
  // True when the fix loop stopped early because a round reproduced a previous
  // findings-set (no progress) — the outstanding findings need human intervention.
  stuck,
  // Suspects block a clean pass: an unresolved device claim needs human eyes.
  passed: outstanding.length === 0 && vetted.suspect.length === 0,
  outstanding,
  suspects: vetted.suspect,
  refuted: vetted.refuted,
}
