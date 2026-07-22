export const meta = {
  name: 'implement-issue-pipeline',
  description:
    'THE issue-implementation pipeline (single encoding): explore → build → wire PR → review ∥ device QA → finding vetting → bounded auto-fix → one consolidated run comment. Gate-free — any clarify/grill conversation happens in the /implement-issue skill BEFORE this launches. Approval happens at PR review before merge.',
  whenToUse:
    'Launched by the /implement-issue skill after its interactive judgment, or invoked directly (headless/batch) on a crisp, pre-approved issue. For uncertain issues run /implement-issue instead — it grills first, then delegates here.',
  phases: [
    { title: 'Explore', detail: 'explorer maps the issue onto the architecture (default on)' },
    { title: 'Build', detail: 'feature-builder implements + opens PR' },
    { title: 'Wire PR', detail: 'assign PR + add to project + verify agent-device current (best-effort)' },
    { title: 'Review', detail: 'code-reviewer checks the diff against the rules (parallel with QA)' },
    { title: 'QA', detail: 'qa-engineer drives the app on the agent-device (default on, parallel with Review)' },
    { title: 'Vet', detail: 'one skeptic per blocking finding tries to refute it before it can trigger a fix' },
    { title: 'Fix', detail: 'feature-builder addresses confirmed findings (history-aware, stops early if stuck)' },
    { title: 'Report', detail: 'assemble and post the ONE consolidated run comment (best-effort, even on abort)' },
  ],
}

// ═════════════════════════════════════════════════════════════════════════════════════
// ARGS — parse, validate, and derive the run options (full contract: wiki AGENTIC_WORKFLOW)
// ═════════════════════════════════════════════════════════════════════════════════════

// Loop cap: the single place to change the auto-fix round limit
const DEFAULT_MAX_FIX_ROUNDS = 2

let rawArgs = args
if (typeof rawArgs === 'string') {
  try {
    rawArgs = JSON.parse(rawArgs)
  } catch {
    // not JSON — fall through and treat it as a bare issue number
  }
}
const opts = typeof rawArgs === 'object' && rawArgs !== null ? rawArgs : { issue: rawArgs }

const issue = opts.issue

if (!issue || !/^\d+$/.test(String(issue))) {
  throw new Error(`implement-issue-pipeline: \`issue\` must be a GitHub issue number, got: ${JSON.stringify(issue)}`)
}

const startedAt = typeof opts.startedAt === 'number' && Number.isFinite(opts.startedAt) ? opts.startedAt : null

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

// ═════════════════════════════════════════════════════════════════════════════════════
// INSTRUMENTATION & REPORTING — token/wall-clock metrics and the consolidated PR comment.
// No pipeline logic in this region; skip it entirely when reading for the flow.
// ═════════════════════════════════════════════════════════════════════════════════════

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

// Wall-clock: workflow scripts cannot read the clock (Date.now() is unavailable — it
// would break run-resume), but AGENTS can. Each tracked agent returns `finishedAtEpoch`
// (`date +%s` as its last action); durations are pure arithmetic between consecutive
// finishes, seeded by the caller-supplied `startedAt`. Cached agents replay their
// original epochs, so resumed runs report historically true durations.
let lastFinishEpoch = startedAt
function fmtDur(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}
function stageDuration(finishEpoch) {
  const valid = typeof finishEpoch === 'number' && Number.isFinite(finishEpoch)
  const base = lastFinishEpoch
  // Advance only forwards: a stale or bogus epoch must not drag the baseline backwards
  // and silently inflate the next stage's duration.
  if (valid && (typeof base !== 'number' || finishEpoch >= base)) lastFinishEpoch = finishEpoch
  if (!valid || typeof base !== 'number') return 'n/a'
  const d = finishEpoch - base
  return d >= 0 ? fmtDur(d) : 'n/a'
}

function recordMetric(label, agentType, tokens, time) {
  seenLabels[label] = (seenLabels[label] || 0) + 1
  const n = seenLabels[label]
  metrics.push({
    agent: n > 1 ? `${label} (#${n})` : label,
    model: agentType ? MODEL_BY_AGENT[agentType] || 'n/a' : 'n/a',
    codegraph: 'n/a',
    time: time || 'n/a',
    tokens,
  })
}

async function trackedAgent(prompt, agentOpts) {
  const before = spent()
  const result = await agent(prompt, agentOpts)
  const time = result && typeof result === 'object' ? stageDuration(result.finishedAtEpoch) : 'n/a'
  recordMetric(agentOpts.label, agentOpts.agentType, tokenDelta(before, spent()), time)
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
    '| Agent | Model | Codegraph | Wall-clock | Output tokens |',
    '| --- | --- | --- | --- | --- |',
    rows,
    '',
    `**Totals** — wall-clock: ${startedAt != null && typeof lastFinishEpoch === 'number' && lastFinishEpoch >= startedAt ? fmtDur(lastFinishEpoch - startedAt) : '`n/a`'} · output tokens: ${fmtTokens(totalTok)}`,
    '',
    '<sub>Wall-clock durations come from agent-reported `date +%s` epochs (workflow scripts cannot read the clock — `Date.now()` is unavailable); a cell is `n/a` when an agent omitted its epoch or no `startedAt` was passed. Codegraph usage is not observable from the runtime, so it is `n/a`. Token figures are per-agent `budget.spent()` deltas, which count OUTPUT tokens only — the harness-level total (input + output) is several times larger, so never reconcile the two. The total is the whole-run delta; the report-posting agent itself can never appear in the table it posts.</sub>',
  ].join('\n')
}

// The ONE consolidated PR comment (always posted, even on abort). Agents never post their
// own comments; their report markdown travels through the structured returns and lands
// here, in collapsible sections under a short header. NOTE: this function reads run state
// declared in the STAGES region below (build, review, qa, vetted, fixHistory, abort state);
// that is safe because it is only CALLED in the Report stage, after all of it exists.
function clip(text, max) {
  const s = typeof text === 'string' ? text : ''
  return s.length > max ? `${s.slice(0, max)}\n\n_…truncated_` : s
}
function section(title, body) {
  return `<details>\n<summary>${title}</summary>\n\n${body && body.trim() ? body : '_not available_'}\n\n</details>`
}
function buildFinalComment() {
  const status = abortError
    ? `⛔ ABORTED at ${abortStage}`
    : outstanding.length === 0 && vetted.suspect.length === 0
      ? '✅ PASSED'
      : '❌ NOT PASSED'
  const reviewV = doReview ? (review ? review.verdict : 'n/a') : 'skipped'
  const qaV = doQa ? (qa ? qaVerdictFrom(qa) : 'n/a') : 'skipped'
  const totalDur =
    startedAt != null && typeof lastFinishEpoch === 'number' && lastFinishEpoch >= startedAt
      ? fmtDur(lastFinishEpoch - startedAt)
      : 'n/a'

  const attention = []
  if (abortError) attention.push(`- ⛔ aborted at ${abortStage}: ${abortError.message || abortError}`)
  for (const f of outstanding) attention.push(`- ❌ outstanding [${f.source}] ${clip(f.text, 300)}`)
  for (const f of vetted.suspect) attention.push(`- ⚠️ suspect, needs human verification [${f.source}] ${clip(f.text, 300)}`)
  if (stuck) attention.push('- 🔁 fix loop stopped early: no progress between rounds')
  if (vetted.refuted.length > 0) attention.push(`- 🚮 ${vetted.refuted.length} finding(s) refuted by vetting — spot-check in the Vetting section`)

  const vetLines = []
  for (const f of vetted.confirmed) vetLines.push(`- CONFIRMED [${f.source}] ${clip(f.text, 300)}\n  - ${clip(f.vetReason, 300)}`)
  for (const f of vetted.suspect) vetLines.push(`- SUSPECT [${f.source}] ${clip(f.text, 300)}\n  - ${clip(f.vetReason, 300)}`)
  for (const f of vetted.refuted) vetLines.push(`- REFUTED [${f.source}] ${clip(f.text, 300)}\n  - ${clip(f.vetReason, 300)}`)

  const buildBody =
    clip(build.report, 15000) +
    fixHistory.map(h => `\n\n---\n\n**Fix round ${h.round}** — ${h.summary}\n\n${clip(h.report, 8000)}`).join('')

  const parts = [
    `## 🤖 Pipeline run — issue #${issue} · ${status}`,
    '',
    `**review ${reviewV} · QA ${qaV} · ${fixAttempts} fix round(s) · wall-clock ${totalDur}**`,
    '',
    build.summary || '',
    attention.length > 0 ? `\n**Needs attention:**\n${attention.join('\n')}` : '',
    '',
    section('🔨 Build report', buildBody),
    section('🔍 Code review', doReview ? clip(review && review.report, 15000) : '_skipped_'),
    section('🧪 Device QA', doQa ? clip(qa && qa.report, 15000) : '_skipped_'),
  ]
  if (vetLines.length > 0) parts.push(section('🕵️ Finding vetting', vetLines.join('\n')))
  parts.push(section('📊 Run metrics', buildMetricsReport()))
  // Hard cap safely under GitHub's 65,536-char comment limit — a clipped tail may leave a
  // <details> tag unclosed (degraded folding) but the comment still posts.
  return clip(parts.join('\n'), 60000)
}

// ═════════════════════════════════════════════════════════════════════════════════════
// SCHEMAS — structured-output contracts, one per agent stage
// ═════════════════════════════════════════════════════════════════════════════════════

const EXPLORE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    report: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['report'],
}

const BUILD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    prUrl: { type: 'string' },
    summary: { type: 'string' },
    report: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['prUrl', 'summary', 'report'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { enum: ['PASS', 'CHANGES-REQUESTED'] },
    blockingFindings: { type: 'array', items: { type: 'string' } },
    report: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['verdict', 'blockingFindings', 'report'],
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
    report: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['items', 'baseline', 'blockingFindings', 'report'],
}

// Skeptic verdict for one blocking finding (adversarial vetting before the fix loop).
const VET_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { enum: ['confirmed', 'refuted', 'suspect'] },
    reason: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['verdict', 'reason'],
}

// Wire agent: PR metadata (best-effort) + agent-device env pre-check. `agentDeviceReady`
// lets the QA agent skip its own version/update ritual — the CLI is machine-global, so a
// check done here benefits QA; only the KNOWLEDGE that it happened must be passed along.
const WIRE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    agentDeviceReady: { type: 'boolean' },
    note: { type: 'string' },
    finishedAtEpoch: { type: 'number' },
  },
  required: ['agentDeviceReady', 'note'],
}

// ═════════════════════════════════════════════════════════════════════════════════════
// PROMPTS — the static ones. Prompts that interpolate run state at declaration time
// (buildPrompt needs the exploration report, wirePrompt needs the PR URL) are declared
// inline in the STAGES flow instead.
// ═════════════════════════════════════════════════════════════════════════════════════

const clarificationsBlock = clarifications
  ? `\n\nClarifications from the pre-build conversation (authoritative additions to the issue's Description):\n${clarifications}`
  : ''

// Appended to every tracked agent's prompt — feeds the wall-clock column (see stageDuration).
const EPOCH_INSTR =
  '\n\nAs your very last action before returning, run `date +%s` and include the number as `finishedAtEpoch` in your structured return.'

const explorePrompt = `Run pre-implementation exploration for GitHub issue #${issue} per your process: map the issue onto the architecture (target feature and dependency tier, files/layers to touch, closest pattern to mirror, integration points, risks, suggested approach). Return the full structured exploration report as the \`report\` string.${clarificationsBlock}${EPOCH_INSTR}`

const reviewPrompt = `Review the change on branch feature/${issue} (issue #${issue}) per your process. Do NOT post any PR comment. Return your overall verdict (PASS or CHANGES-REQUESTED), the list of blocking findings (empty if none), and your full review report markdown as \`report\`.${EPOCH_INSTR}`

const qaPrompt = deviceReady =>
  `Run device QA for issue #${issue} on branch feature/${issue} via agent-device per your process (baseline checks + acceptance criteria). Do NOT post any PR comment. Return the structured result mirroring your report: items[] (one entry per test item — id, the acceptance criterion it verifies verbatim, class, per-item verdict, one-line note with evidence path on FAIL), baseline[] ({check, pass} per baseline check), blockingFindings (empty if none), notPerformedReason ONLY if the app could not be run, and your full QA report markdown as \`report\`. Do NOT compute an overall verdict — the pipeline derives it from the items. Every acceptance criterion must appear in items; if one could not be exercised, report it as BLOCKED with the reason.${
    deviceReady
      ? ' The agent-device CLI has already been verified current in this run — skip your version/update check entirely.'
      : ''
  }${EPOCH_INSTR}`

// History-aware fix prompt (e2): findings that survived a previous attempt are marked
// [PERSISTS] and the builder is told what was already tried — round N is an escalation
// with new information, not a reroll of round N−1.
const fixPrompt = (findings, attempt, history, persistedKeys) =>
  `Fix mode for issue #${issue} (attempt ${attempt}/${MAX_FIX}). Branch feature/${issue} and its PR already exist — do NOT create a new branch or PR, and do NOT post any PR comment. Address these CONFIRMED blocking findings as new commits on the existing branch, then return the PR URL, a one-line summary of the fixes, and your fix report markdown as \`report\`:\n${findings
    .map((f, i) => `${i + 1}. [${f.source}]${persistedKeys.has(findingKey(f)) ? ' [PERSISTS — a previous fix attempt did NOT clear this]' : ''} ${f.text}`)
    .join('\n')}${
    history.length > 0
      ? `\n\nPrevious fix attempts in this run:\n${history
          .map(h => `- Attempt ${h.round}: "${h.summary}"`)
          .join('\n')}\nFindings marked [PERSISTS] survived those attempts — the tried approach is wrong for them. Do NOT repeat it: re-diagnose from scratch (read the code around your previous fix commits, check the adjacent layer, question the assumed root cause) and take a different angle.`
      : ''
  }${EPOCH_INSTR}`

// Arrow function — `build.prUrl` resolves at call time, after the Build stage has run.
const vetPrompt = f =>
  `Adversarially verify ONE ${f.source === 'qa' ? 'device-QA' : 'code-review'} finding for issue #${issue} (branch feature/${issue}, PR ${build.prUrl}) per your process. The finding:\n\n"${f.text}"\n\nTry to refute it against the actual diff, code, and captured QA evidence. Return confirmed, refuted, or suspect with your reason.${EPOCH_INSTR}`

// ═════════════════════════════════════════════════════════════════════════════════════
// STAGE HELPERS — verify (review ∥ QA), verdict derivation, finding fingerprints, vetting
// ═════════════════════════════════════════════════════════════════════════════════════

async function verify() {
  if (!doReview && !doQa) return { review: null, qa: null }
  // Review ∥ QA: the two verify stages are independent — code-reviewer reads committed
  // refs via `git diff` (never the working tree), qa-engineer owns the device/checkout —
  // so they run in parallel: wall-clock = max(review, qa) instead of review + qa.
  // Per-agent `phase` opts (not the global phase()) keep the progress groups race-free.
  const before = spent()
  const baseEpoch = lastFinishEpoch
  const kinds = []
  const thunks = []
  if (doReview) {
    kinds.push('review')
    thunks.push(() => agent(reviewPrompt, { agentType: 'code-reviewer', label: `review:${issue}`, phase: 'Review', schema: REVIEW_SCHEMA }))
  }
  if (doQa) {
    kinds.push('qa')
    thunks.push(() => agent(qaPrompt(agentDeviceReady), { agentType: 'qa-engineer', label: `qa:${issue}`, phase: 'QA', schema: QA_SCHEMA, ...iso }))
  }
  const results = await parallel(thunks)
  const delta = tokenDelta(before, spent())

  const byKind = {}
  kinds.forEach((k, i) => {
    byKind[k] = results[i]
  })
  // Preserve whichever branch DID complete before failing loudly — the abort report must
  // not lose a section produced by the surviving parallel agent. The dead branch is set
  // to null (not left stale from a previous round) so the report marks it unavailable
  // instead of passing off a pre-fix result as current.
  if (doReview) review = byKind.review || null
  if (doQa) qa = byKind.qa || null
  // parallel() resolves a failed/skipped agent to null instead of throwing — fail loudly
  // here rather than letting a missing verdict read as "nothing blocking" downstream.
  if (doReview && !byKind.review) throw new Error(`code-reviewer returned no result for issue #${issue}`)
  if (doQa && !byKind.qa) throw new Error(`qa-engineer returned no result for issue #${issue}`)

  // Durations: both branches started from the same base, so each gets its own wall-clock
  // even though tokens can only be attributed as a combined row (concurrent budget deltas
  // overlap). Advance the shared epoch to the later of the two finishes.
  const finishes = kinds.map(k => (byKind[k] && typeof byKind[k].finishedAtEpoch === 'number' ? byKind[k].finishedAtEpoch : null))
  const branchDur = f => (typeof f === 'number' && typeof baseEpoch === 'number' && f >= baseEpoch ? fmtDur(f - baseEpoch) : 'n/a')
  const maxFinish = Math.max(...finishes.filter(f => typeof f === 'number'), Number.NEGATIVE_INFINITY)
  // Same forward-only rule as stageDuration.
  if (Number.isFinite(maxFinish) && (typeof baseEpoch !== 'number' || maxFinish >= baseEpoch)) lastFinishEpoch = maxFinish
  if (kinds.length === 1) {
    recordMetric(`${kinds[0]}:${issue}`, kinds[0] === 'review' ? 'code-reviewer' : 'qa-engineer', delta, branchDur(finishes[0]))
  } else {
    recordMetric(`verify:${issue} (review ∥ qa)`, null, delta, `${branchDur(finishes[0])} ∥ ${branchDur(finishes[1])}`)
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

// Vet: adversarial check of every blocking finding before it can trigger a fix.
// A false finding sent to fix mode makes the builder "fix" correct code (known real case:
// device QA misreading layered-Animated buttons as non-hittable). One skeptic per finding
// tries to REFUTE it; only confirmed findings reach the builder. Device-runtime claims the
// skeptic can't check from code + captured evidence become `suspect` — surfaced for human
// eyes, never auto-fixed. Fail-safe: a dead vetter confirms (status quo), never drops.
async function vetFindings(findings) {
  if (findings.length === 0) return { confirmed: [], refuted: [], suspect: [] }
  const before = spent()
  const results = await parallel(
    findings.map((f, i) => () =>
      agent(vetPrompt(f), { agentType: 'finding-vetter', label: `vet:${issue}#${i + 1}`, phase: 'Vet', schema: VET_SCHEMA })),
  )
  const delta = tokenDelta(before, spent())
  const vetEpochs = results.filter(Boolean).map(r => r.finishedAtEpoch).filter(n => typeof n === 'number' && Number.isFinite(n))
  const vetTime = vetEpochs.length > 0 ? stageDuration(Math.max(...vetEpochs)) : 'n/a'
  recordMetric(findings.length === 1 ? `vet:${issue}` : `vet:${issue} (x${findings.length})`, 'finding-vetter', delta, vetTime)

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

// ═════════════════════════════════════════════════════════════════════════════════════
// STAGES — the pipeline flow: explore → build → wire → (verify ∥) → vet → fix loop →
// consolidated report → return (abort in any post-build stage still posts the report)
// ═════════════════════════════════════════════════════════════════════════════════════

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

const buildPrompt = `Implement GitHub issue #${issue} for HolidAI, following your full process: read the issue, obey the architecture rules, verify with tsc + arch (once, before the commit sequence), create branch feature/${issue}, commit in small layer-aligned commits, and open the PR with an empty body. Do NOT post any PR comment. Return the PR URL, a one-line summary, and your full structured report markdown as \`report\`.${clarificationsBlock}${explorerBlock}${EPOCH_INSTR}`

phase('Build')
const build = await trackedAgent(buildPrompt, { agentType: 'feature-builder', label: `build:${issue}`, schema: BUILD_SCHEMA, ...iso })
// No PR means nowhere to post a run report — a build failure is the one truly fatal stage.
if (!build || !build.prUrl) throw new Error(`build stage returned no PR for issue #${issue}`)
log(`Built issue #${issue} → ${build.prUrl}`)

const wirePrompt = `PR wiring + environment pre-check for the pull request ${build.prUrl}. Change PR METADATA ONLY — never edit the PR body or title (those are owned by the setup-pr workflow), and do not add issue-linking. Do exactly three things:
1. Assign the PR to timothyrusso: \`gh pr edit ${build.prUrl} --add-assignee timothyrusso\`.
2. Add the PR to GitHub Project #1: \`gh project item-add 1 --owner timothyrusso --url ${build.prUrl}\`. This needs the \`project\` scope on the gh token, which is currently MISSING. If step 2 fails with a scope/authorization error, do NOT abort and do NOT undo step 1 — note the exact remediation \`gh auth refresh -s project\` and treat the run as fine. Step 1 must still stand.
3. Verify the agent-device CLI is current: \`agent-device --version\`; if missing or outdated, run \`npm i -g agent-device@latest\` and re-check. Return \`agentDeviceReady: true\` ONLY if you verified it is current (or successfully updated it); \`false\` on any doubt or failure.
Summarise the outcome of all three in \`note\`.${EPOCH_INSTR}`
// Set by the wire agent; lets the QA agent skip its own version/update ritual.
let agentDeviceReady = false
try {
  phase('Wire PR')
  // Mechanical gh/npm commands — low effort is enough and cheaper/faster.
  const wire = await trackedAgent(wirePrompt, { agentType: 'general-purpose', label: `wire:${issue}`, effort: 'low', schema: WIRE_SCHEMA })
  agentDeviceReady = Boolean(wire && wire.agentDeviceReady === true)
} catch (e) {
  log(`PR wiring step failed (non-blocking): ${e && e.message ? e.message : e}`)
}

// Everything after build is wrapped: whatever happens, the run posts its ONE consolidated
// PR comment at the end. An aborted run reports as ABORTED with the sections it collected,
// then rethrows — no more silent losses of already-produced reports.
let review = null
let qa = null
let vetted = { confirmed: [], refuted: [], suspect: [] }
let fixAttempts = 0
let stuck = false
let abortError = null
let abortStage = null
const seenRounds = new Set() // fingerprint of every findings-set already fixed against (e1)
const fixHistory = [] // { round, summary, report } — feeds later fix prompts (e2) + the final comment
let prevKeys = new Set() // last round's finding keys, for [PERSISTS] annotations

try {
  abortStage = 'verify'
  ;({ review, qa } = await verify())
  abortStage = 'vet'
  vetted = await vetFindings(blockingFrom(review, qa))

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
    abortStage = `fix round ${fixAttempts}`
    phase('Fix')
    const fix = await trackedAgent(fixPrompt(vetted.confirmed, fixAttempts, fixHistory, prevKeys), { agentType: 'feature-builder', label: `fix:${issue}#${fixAttempts}`, schema: BUILD_SCHEMA, ...iso })
    fixHistory.push({ round: fixAttempts, summary: fix && fix.summary ? fix.summary : 'n/a', report: fix && fix.report ? fix.report : '' })
    prevKeys = new Set(vetted.confirmed.map(findingKey))
    abortStage = 'verify'
    ;({ review, qa } = await verify())
    abortStage = 'vet'
    vetted = await vetFindings(blockingFrom(review, qa))
  }
} catch (e) {
  abortError = e
  log(`Run aborted at ${abortStage}: ${e && e.message ? e.message : e} — posting the run report anyway`)
}

const outstanding = vetted.confirmed

try {
  phase('Report')
  const finalComment = buildFinalComment()
  const reportPrompt = `Post the pipeline run report below as a NEW comment on the pull request ${build.prUrl}. Do NOT edit the PR body, the PR title, or any existing comment — this must be an additional, standalone comment. Write everything between the <<<REPORT and REPORT>>> markers (excluding the markers themselves) VERBATIM — no edits, no summarising, no extra text — to a temp file, then run \`gh pr comment ${build.prUrl} --body-file <that-file>\`.

<<<REPORT
${finalComment}
REPORT>>>`
  // Verbatim posting of pre-built markdown — low effort is enough and cheaper/faster.
  // (Tracked, but it posts the report built just above it, so it is the one agent whose
  // own row can never appear in the table it posts.)
  await trackedAgent(reportPrompt, { agentType: 'general-purpose', label: `report:${issue}`, effort: 'low' })
} catch (e) {
  log(`Run-report step failed (non-blocking): ${e && e.message ? e.message : e}`)
}

// The report is posted; now surface the abort to the caller with normal failure semantics.
if (abortError) throw abortError

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
