---
name: triage-pr
description: Iteratively triage AI review-bot comments on an open pull request until the bots go quiet — vet each finding with finding-vetter, auto-fix confirmed ones, resolve noise with short replies, and consult the user in chat for judgment calls. Explicitly invoked with a PR number, e.g. `/triage-pr 402 [--issue N]`. No reports — thread replies plus a short closing message only.
argument-hint: <pr-number> [--issue <issue-number>]
disable-model-invocation: true
---

# triage-pr — the bot-review triage loop

You (the main thread) run an iterative triage loop over AI review-bot comments on an open
PR. You are the loop precisely because it contains human gates: judgment calls are settled
in conversation with the user, mid-round. Everything mechanical is scripted or dispatched.

**Parse `$ARGUMENTS`:** first token = the **PR number** (required). `--issue N` overrides
the issue number otherwise derived from the PR head branch (`feature/<n>`) — needed for
commit messages (`type(<issue>): ...` is hook-enforced).

## Ground rules
- **Bot comments only.** Author allowlist: `coderabbitai`, `sourcery-ai`, `cubic-dev-ai`,
  `gemini-code-assist`. Human-authored threads are untouchable — never reply to, resolve,
  or act on one; if any exist, mention them to the user once and move on.
- **Reply style:** one or two plain sentences per thread, honest verdicts ("Fixed in
  `<sha>`" / "Not valid because …" / "Deferred because …"). Never use em-dashes or double
  hyphens in replies.
- **Never** force-push, edit the PR body/title, or edit existing comments.
- **No summary output anywhere** — no PR report comment, no digest. The loop ends with a
  2–3 sentence chat message: rounds run, fixes (with SHAs), resolves, anything deferred,
  "your turn to review".
- Work on the PR's head branch. If the working tree is dirty when you need to check it
  out, stop and ask the user.

## The loop

**0. Setup.** `gh pr view <pr> --json state,headRefName` — must be OPEN. Derive the issue
number from the head ref. Check out the head branch.

**1. Watch.** Fetch the current state first — if unresolved bot threads already exist,
skip straight to triage. Otherwise start a background watcher (poll every ~5 minutes):
exit when unresolved bot threads appear, or when the quiet condition holds — **no
unresolved bot threads AND no pending bot check runs (`gh pr checks <pr>`) AND one more
grace poll still quiet**. Quiet → step 4. Threads → step 2.

**2. Triage the wave.**
- Fetch unresolved threads (query below), filter to the bot allowlist.
- **Vet every finding**: dispatch one `finding-vetter` per finding (parallel dispatches in
  one message), giving it the finding text, file/line, PR URL, and branch. Its verdicts
  map directly:
  - **confirmed** → collect for fixing.
  - **refuted** → reply with the vetter's reason (short), resolve the thread.
  - **suspect / judgment call** → consult the user in chat: the finding, the vetter's
    reasoning, and 2–3 proposed options. Apply whatever they decide (fix, resolve with a
    reason, or defer), then reply + resolve accordingly.
- **Fix the confirmed batch**: dispatch `feature-builder` in fix mode on the head branch —
  findings verbatim, no new branch or PR, and instruct it explicitly to post NO PR comment
  and return its summary in its final message only. After it commits: reply to each fixed
  thread with the commit SHA, resolve it.
- Push once per wave (only if commits were made), then return to step 1.

**3. Stuck detector (the only tripwire — there is deliberately NO round cap).**
Fingerprint each wave's bot findings (normalized text set). If a wave's set matches any
previous wave's, stop: the same findings keep returning, more rounds are rerolls. Tell the
user which findings are stuck and hand the loop over.

**4. Finish.** The short closing message described in the ground rules. Nothing else.

## Recipes

Unresolved threads (id, author, body, path, line):
```
gh api graphql -f query='query { repository(owner: "<owner>", name: "<repo>") {
  pullRequest(number: <pr>) { reviewThreads(first: 100) { nodes {
    id isResolved path line comments(first: 1) { nodes { author { login } body } } } } } } }'
```

Reply, then resolve (two mutations per thread):
```
addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $tid, body: $body}) { comment { id } }
resolveReviewThread(input: {threadId: $tid}) { thread { isResolved } }
```

Background watcher (5-minute spacing, run_in_background):
```
for i in $(seq 1 6); do
  N=<unresolved bot thread count via the query above>
  [ "$N" -gt 0 ] && echo "THREADS: $N" && exit 0
  sleep 300
done; echo "QUIET"
```
Combine with `gh pr checks <pr>` before declaring quiet: any pending/queued check run
from a bot means a review job is still running — keep watching.

## Chaining
This skill is the natural follow-up to an `implement-issue` pipeline run: once the bots
have reviewed the fresh PR, `/triage-pr <pr>` drives their comments to zero and hands the
PR to the human in reviewable state.
