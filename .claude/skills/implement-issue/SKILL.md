---
name: implement-issue
description: Implement a GitHub feature issue end-to-end — clarify → (explore) → plan approval → build → code review → device QA → one auto-fix on failure. Explicitly invoked with an issue number, e.g. `/implement-issue 378 [--explore] [--skip-review] [--skip-qa] [--worktree]`.
argument-hint: <issue-number> [--explore] [--skip-review] [--skip-qa] [--worktree]
disable-model-invocation: true
---

# implement-issue — end-to-end feature implementation

You (the main thread) orchestrate a feature from a GitHub issue through:
clarify → (explore) → approve → build → review → QA → one automatic fix on failure.
You can talk to the user AND dispatch subagents; use both.

**Parse `$ARGUMENTS`:**
- First token = the **issue number** (required).
- `--explore` → run Stage 2 (a dedicated exploration pass before the plan).
- `--skip-review` → skip Stage 5 (code review).
- `--skip-qa` → skip Stage 6 (device QA).
- `--worktree` → run the code-touching work in isolated git worktrees (opt-in; default is
  the current working tree).

Work the stages in order. Do not skip the two human gates (Stages 1 and 3).

## Stage 0 — Setup
- `gh issue view <issue>`; confirm it is a Feature-template issue (has `### Description` and
  `### Acceptance criteria`). If not, tell the user and ask how to proceed.

## Stage 1 — Clarify gate (interactive)
- Read the Description + Acceptance criteria critically. Look for genuine ambiguities, gaps,
  contradictions, or risky assumptions that would change what gets built.
- **If there are real doubts:** use the `grilling` skill to interview the user and resolve
  them, staying focused on what affects the implementation.
- **If the issue is crisp and complete:** skip grilling — say so; don't manufacture questions.
- If anything was clarified, post a concise **Clarifications** summary as an issue comment
  (`gh issue comment <issue> --body-file <file>`) and keep the clarified points for later.

## Stage 2 — Explore — only if `--explore`
- Dispatch the `explorer` subagent (`subagent_type: explorer`) with the issue number and any
  Stage 1 clarifications. (Read-only — no worktree needed.)
- It returns a structured exploration report (target feature/tier, files to touch, pattern to
  mirror, integration points, risks, suggested approach). Keep it for Stages 3 and 4.
- If `--explore` was not passed, skip this stage; you'll form the approach yourself in Stage 3.

## Stage 3 — Approve gate (interactive)
- Present: your understanding of the feature, the acceptance criteria you'll build to, and a
  short implementation approach (which feature/folder, which layers). If Stage 2 ran, base
  this on the explorer's report.
- Wait for the user's go-ahead; adjust if they push back. Do not write code without approval.

## Stage 4 — Implement
- Dispatch the `feature-builder` subagent (`subagent_type: feature-builder`; add
  `isolation: worktree` **iff** `--worktree`). Give it the issue number, the Stage 1
  clarifications, and — if Stage 2 ran — the exploration report inline, so it doesn't
  re-explore.
- It branches, implements, verifies (tsc + arch), commits, opens the PR, posts its report
  comment, and returns the PR URL. Capture that URL.

## Stage 5 — Code review (static) — skip if `--skip-review`
- Dispatch the `code-reviewer` subagent (`subagent_type: code-reviewer`) with the issue
  number. (No worktree needed — it reads committed refs via `git diff`.)
- It reviews the diff against CLAUDE.md rules + correctness, posts a review comment, and
  returns a verdict (`PASS` / `CHANGES-REQUESTED`) with the blocking findings. Keep those.

## Stage 6 — Device QA — skip if `--skip-qa`
- Dispatch the `qa-engineer` subagent (`subagent_type: qa-engineer`; add `isolation: worktree`
  **iff** `--worktree`) with the issue number.
- It checks out the branch, runs baseline + acceptance-criteria QA on the agent-device, posts
  the QA comment, and returns an overall verdict with findings.

## Stage 7 — Fix-loop (cap 1, automatic)
- Collect **blocking findings** from Stage 5 (review `CHANGES-REQUESTED`) and Stage 6
  (QA `FAIL`).
- **If there are any blocking findings:**
  - Dispatch `feature-builder` once more in **fix mode** (add `isolation: worktree` iff
    `--worktree`): state that branch `feature/<issue>` and its PR already exist, include ALL
    blocking findings (review + QA) verbatim, and instruct it to apply the fixes as new
    commits on the existing branch — no new branch, no new PR.
  - Re-run the enabled verify stages once: re-review (if review is on) and re-QA (if QA is on).
    - All enabled verify stages now pass → Stage 8.
    - Anything still blocking → **STOP** (cap = 1). Report to the user for human intervention
      with the outstanding findings. Do not loop again.
- Non-blocking outcomes never trigger the loop: review non-blocking nits, and QA
  `BLOCKED` / `NEEDS-REVIEW` / `NOT PERFORMED` — surface them in Stage 8 for the user.

## Stage 8 — Report
- Summarize: the PR URL, the review verdict, the QA verdict, what happened each iteration
  (build → review → QA → fix? → re-review + re-QA?), and anything needing the user's attention.
- Do not merge the PR.

## Notes
- explorer, feature-builder, code-reviewer, and qa-engineer run **sequentially** — never in
  parallel; they share the branch, and (without `--worktree`) the working tree and the device.
- All handoffs are through committed/pushed git state, which is why `--worktree` can isolate
  each code-touching agent safely.
- `--worktree` isolates the filesystem so humans can keep editing the main checkout, but a
  fresh worktree has no `node_modules`/native build — expect a **cold app build** in the QA
  stage (or have the agent attach to an already-running app). The simulator itself is shared.
- This skill is long-running and drives the simulator; the QA stages take the most time.
