---
name: grill-and-implement
description: Grill a GitHub feature issue with the user, fold the resulting clarifications back into the issue body, then hand the improved issue to the unattended implement-issue-auto workflow. Use when an issue deserves an interactive stress-test before an unattended build — the human grilling pass happens up front, then the workflow runs gate-free.
argument-hint: <issue-number>
disable-model-invocation: true
---

# grill-and-implement — grill an issue, improve it, then build it unattended

You (the main thread) run a short **interactive** pass over a GitHub issue and then launch the
unattended `implement-issue-auto` workflow on the improved issue. The grilling and the issue
rewrite happen **here, interactively** — never inside the workflow, which must stay gate-free.

**Parse `$ARGUMENTS`:** the first token is the **issue number** (required). If it's missing,
ask the user which issue to work on.

## Stage 0 — Load the issue
- `gh issue view <issue>`; confirm it is a Feature-template issue (has `### Description` and
  `### Acceptance criteria`). If not, tell the user and ask how to proceed.

## Stage 1 — Grill (interactive)
- Run the `grilling` skill on this issue: interview the user one question at a time to surface
  and resolve every real doubt, gap, contradiction, or risky assumption that would change what
  gets built. When a question can be answered by reading the codebase, explore instead of asking.
- Stay focused on what affects the implementation and the acceptance criteria. Keep going until
  the issue would be unambiguous to an agent building it with no further questions.
- If the issue is already crisp and complete, say so — don't manufacture questions.

## Stage 2 — Fold the clarifications back into the issue body
- Rewrite the issue so it is the single improved source of truth: update the `### Description`
  and `### Acceptance criteria` sections (and `### Out of scope` if the grilling changed scope)
  to incorporate every clarification you just resolved. Keep the **exact** Feature-template
  headings so the downstream workflow parses it identically. Do not pad or invent scope —
  reflect only what the user actually confirmed.
- Apply the edit to the issue **body** on GitHub with `gh issue edit <issue> --body-file <file>`.
  The body itself must change — a comment is not enough; the issue is the source of truth the
  workflow reads.
- Show the user the rewritten body and get their explicit go-ahead before applying it (editing
  the issue is an outward action).

## Stage 3 — Launch the unattended workflow
- Launch the `implement-issue-auto` workflow (`.claude/workflows/implement-issue-auto.js`) on
  the improved issue, e.g. with `{ issue: <issue-number> }` (pass `qa: true` to opt into device
  QA, `worktree: true` to isolate the code-touching work). From here it is gate-free:
  build → PR wiring → review → (optional) QA → bounded auto-fix, ending in an open PR with the
  feature-builder, review, QA, and run-metrics comments.
- Report the PR URL the workflow returns.

## Rules
- The grilling and the issue rewrite are strictly part of this skill (interactive). Never move
  them into `implement-issue-auto`, which must stay unattended and gate-free.
- Never edit the issue body without the user's explicit approval.
- Keep the Feature-template headings intact so the downstream workflow parses the issue.
