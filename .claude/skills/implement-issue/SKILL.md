---
name: implement-issue
description: Implement a GitHub feature issue end-to-end. Judges the issue — grills the user only if something genuinely needs clarifying (folding answers back into the issue body) — announces its reading, then launches the implement-issue-pipeline workflow (explore → build → wire PR → review → device QA → bounded auto-fix → run metrics). Explicitly invoked with an issue number, e.g. `/implement-issue 378 [--skip-explore] [--skip-review] [--skip-qa] [--worktree] [--max-fix N]`.
argument-hint: <issue-number> [--skip-explore] [--skip-review] [--skip-qa] [--worktree] [--max-fix N]
disable-model-invocation: true
---

# implement-issue — judge, clarify if needed, then delegate to the pipeline

You (the main thread) own only the **conversation**: judging the issue, grilling when
genuinely needed, announcing your reading, and relaying the result. The entire build
pipeline lives in ONE place — the `implement-issue-pipeline` workflow — and you must
NEVER re-implement any of its stages (explore/build/review/QA/fix) here or dispatch
those agents yourself. Your job ends where the workflow begins.

**Parse `$ARGUMENTS`:**
- First token = the **issue number** (required). If missing, ask which issue to work on.
- Flags are **overrides only** — canonical defaults live in the workflow (explore, review,
  QA all ON; worktree OFF). Map each flag the user passed to a workflow arg, and pass
  NOTHING for flags they didn't:
  - `--skip-explore` → `explore: false`
  - `--skip-review` → `review: false`
  - `--skip-qa` → `qa: false`
  - `--worktree` → `worktree: true` (isolation; expect a cold install/build in the worktree)
  - `--max-fix N` → `maxFix: N`

## Stage 0 — Setup
- `gh issue view <issue>`; confirm it is a Feature-template issue (has `### Description` and
  `### Acceptance criteria`). If not, tell the user and ask how to proceed.

## Stage 1 — Judge (the only routing decision)
Read the Description + Acceptance criteria critically. Look for genuine ambiguities, gaps,
contradictions, or risky assumptions that would change what gets built.

- **If the issue is crisp and complete:** say so and move on — do NOT manufacture questions,
  and do NOT wait for approval. PR review is the approval gate for crisp issues.
- **If there are real doubts:** run the `grilling` skill — interview the user one question at
  a time until the issue would be unambiguous to an agent building it with no further
  questions. When a question can be answered by reading the codebase, explore instead of
  asking. Stay focused on what affects the implementation and the acceptance criteria.

**Fold clarifications back into the issue body** (only if grilling happened):
- Rewrite the issue so it is the single improved source of truth: update `### Description`
  and `### Acceptance criteria` (and `### Out of scope` if scope changed) to incorporate
  every resolved clarification. Keep the **exact** Feature-template headings. Do not pad or
  invent scope — reflect only what the user actually confirmed.
- Show the user the rewritten body and get their explicit go-ahead, then apply it with
  `gh issue edit <issue> --body-file <file>` (editing the issue is an outward action).
- **Fallback** — if the user declines the body edit: post the clarifications as an issue
  comment instead (`gh issue comment <issue> --body-file <file>`) and pass them to the
  workflow via the `clarifications` arg.

## Stage 2 — Announce, don't ask
- **If you grilled:** the synthesis at the end of the grilling conversation ("so I'll build
  X, Y, Z") already served as the announcement — proceed directly to Stage 3.
- **If the issue was crisp:** state your reading in ONE short message — the acceptance
  criteria as you understand them, the feature/area you expect it to touch, and any flags
  in effect — then IMMEDIATELY proceed to Stage 3 without waiting for a reply. The user
  interrupts if the reading is wrong; silence is consent.

## Stage 3 — Delegate to the pipeline
- Invoke the **Workflow tool** with `{ name: "implement-issue-pipeline", args: { issue: <n>,
  ...overrides } }` — include `clarifications` only in the fallback case above. This skill
  explicitly authorizes that Workflow call.
- The workflow runs explore → build → wire PR → review → device QA → bounded auto-fix →
  run-metrics comment, and returns `{ prUrl, explored, reviewVerdict, qaVerdict, fixAttempts,
  passed, outstanding }`.
- While it runs, do not poll or narrate; report when it completes.

## Stage 4 — Report
- Relay the result: the PR URL, review verdict, QA verdict, fix attempts, and anything
  outstanding that needs the user's attention (non-blocking review nits, QA
  `BLOCKED`/`NEEDS-REVIEW`/`NOT_PERFORMED`, or findings left after the fix cap).
- Do not merge the PR.

## Notes
- **Headless/batch entry:** for unattended runs (queue draining, overnight), invoke the
  `implement-issue-pipeline` workflow directly — same pipeline, no conversation. This skill
  is the human-present front door.
- **One encoding rule:** any change to pipeline behavior (stages, defaults, prompts, caps)
  belongs in `.claude/workflows/implement-issue-pipeline.js` — never here.
- This skill is long-running once delegated; the QA stage drives the simulator and takes
  the most time.
