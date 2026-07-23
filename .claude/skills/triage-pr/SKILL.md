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
    reasoning, and 2–3 proposed options. If they decide **fix**, the finding JOINS the
    confirmed fix batch below — its commit must exist before its thread is replied to and
    resolved (never resolve a fix decision on words alone). If they decide **resolve** or
    **defer**, reply with their reason and resolve.
- **Fix the confirmed batch**: dispatch `feature-builder` in fix mode on the head branch —
  findings verbatim, no new branch or PR, and instruct it explicitly to post NO PR comment
  and return its summary in its final message only. After it commits: reply to each fixed
  thread with the commit SHA, resolve it.
- Push once per wave (only if commits were made), then return to step 1.

**3. Stuck detector (the only tripwire — there is deliberately NO round cap).**
Fingerprint each wave's bot findings as a **sorted multiset of thread identities**
(`path:line` plus normalized text, joined and sorted — same semantics as the pipeline's
`roundFingerprint`). Never a plain text set: that collapses identical findings at
different locations, so fixing one occurrence while the other legitimately persists would
fake a stuck state and stop the loop with a fixable finding still open. If a wave's
fingerprint matches any previous wave's, stop: the same findings keep returning, more
rounds are rerolls. Tell the user which findings are stuck and hand the loop over.

**4. Finish.** The short closing message described in the ground rules. Nothing else.

## Recipes

Unresolved threads (id, author, body, path, line). Resolved threads consume the page
budget too — if `hasNextPage` is true, paginate with `after: "<endCursor>"` before
trusting any count, or unresolved threads past the page can silently read as zero:
```
gh api graphql -f query='query { repository(owner: "<owner>", name: "<repo>") {
  pullRequest(number: <pr>) { reviewThreads(first: 100) { pageInfo { hasNextPage endCursor } nodes {
    id isResolved path line comments(first: 1) { nodes { author { login } body } } } } } } }'
```

Reply, then resolve (two complete commands per thread):
```
gh api graphql -f query='mutation($tid: ID!, $body: String!) { addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $tid, body: $body}) { comment { id } } }' -f tid=<thread-id> -f body=<reply text>
gh api graphql -f query='mutation($tid: ID!) { resolveReviewThread(input: {threadId: $tid}) { thread { isResolved } } }' -f tid=<thread-id>
```

Background watcher (5-minute spacing, run_in_background) — this loop IS the quiet
condition: threads exit early; QUIET requires no threads AND no pending bot checks held
across one extra grace poll:
```
QUIET=0
for i in $(seq 1 12); do
  N=<unresolved BOT thread count via the query above, paginated>
  [ "$N" -gt 0 ] && echo "THREADS: $N" && exit 0
  PENDING=$(gh pr checks <pr> 2>/dev/null | grep -ciE "pending|in progress|queued" || true)
  if [ "$PENDING" -eq 0 ]; then
    QUIET=$((QUIET+1))
    [ "$QUIET" -ge 2 ] && echo "QUIET" && exit 0
  else
    QUIET=0
  fi
  sleep 300
done
echo "WINDOW_CLOSED: bots still busy, re-run the watcher"
```

## Chaining
This skill is the natural follow-up to an `implement-issue` pipeline run: once the bots
have reviewed the fresh PR, `/triage-pr <pr>` drives their comments to zero and hands the
PR to the human in reviewable state.
