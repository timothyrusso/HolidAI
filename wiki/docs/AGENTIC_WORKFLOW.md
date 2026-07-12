# Agentic Workflow

HolidAI ships an AI-assisted, GitHub-native pipeline that takes a feature issue and produces a
reviewable pull request — implemented, statically reviewed against our rules, and QA'd on a
device. It is built entirely from Claude Code primitives (subagents, skills, a workflow, and the
project's own rules) and lives under `.claude/`.

You **author** issues with the `write-issue` skill, then **run** them either interactively
(`/implement-issue`, human-gated) or unattended (`implement-issue-auto`, a deterministic
workflow). See [Entry points](#entry-points).

---

## Prerequisites

- **agent-device** installed and configured (once per developer) — see
  [agent-device.dev](https://agent-device.dev/) or the `agent-device-configuration` skill. The
  project commits the `Bash(agent-device *)` permission and the `agent-device` skill router, so
  only the per-machine binary + env vars are needed.
- **`gh`** authenticated for the HolidAI repository.
- The iOS app buildable/runnable on a simulator (the QA stage drives it via agent-device).
- **CodeGraph** — `npm install` (pins the `@colbymchenry/codegraph` devDependency), then
  `npx codegraph init` once to build the local index (`.codegraph/`, gitignored, auto-synced).
  The committed `.mcp.json` gives `explorer`/`feature-builder` the code-intelligence MCP.

---

## The pieces

| Piece | Location | Role |
|---|---|---|
| Feature issue template | `.github/ISSUE_TEMPLATE/feature.yml` | The **input contract** — `### Description` (what to build) + `### Acceptance criteria` (what QA verifies). Required fields. |
| `write-issue` | `.claude/skills/write-issue/SKILL.md` | Authors a complete, template-conformant issue via `grilling` — front-loads clarification. |
| `explorer` | `.claude/agents/explorer.md` | Read-only. Maps an issue onto the architecture (target feature/tier, files, pattern, risks). Optional. |
| `feature-builder` | `.claude/agents/feature-builder.md` | Implements, verifies (tsc + arch), commits in small layer-aligned commits, opens the PR. |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | Read-only. Reviews the diff against the rules the linters *don't* enforce. |
| `qa-engineer` | `.claude/agents/qa-engineer.md` | Drives the app on the agent-device (baseline + acceptance criteria); posts a PASS/FAIL report. |
| `qa-baseline` | `.claude/skills/qa-baseline/SKILL.md` | Standing regression checks run for *every* feature (startup, render, navigation). |
| `implement-issue` | `.claude/skills/implement-issue/SKILL.md` | Interactive, human-gated orchestrator. |
| `implement-issue-auto` | `.claude/workflows/implement-issue-auto.js` | Unattended, deterministic orchestrator (no gates; QA opt-in) — reuses the same agents. |
| CodeGraph | `.mcp.json` + `@colbymchenry/codegraph` | Code-intelligence MCP (symbols, call paths, blast radius) that `explorer`/`feature-builder` query instead of grepping. Local index in `.codegraph/` (gitignored). |

Each agent reads the deep architecture docs — [`ARCHITECTURE.md`](ARCHITECTURE.md) and
[`ERROR_HANDLING.md`](ERROR_HANDLING.md) — rather than duplicating the rules.

---

## Entry points

```
write-issue (skill, grilling)  ──►  a complete GitHub issue
      ├──►  /implement-issue (skill)          interactive, human-gated — uncertain / in-the-loop
      └──►  implement-issue-auto (workflow)   unattended, deterministic — crisp / batch / CI
```

- **`write-issue`** interviews you (via `grilling`) and creates a complete, template-conformant
  issue, so downstream runs need no further clarification.
- **`/implement-issue`** runs the stages below with the two human gates (clarify, approve).
- **`implement-issue-auto`** runs build → review → QA → bounded fix deterministically with **no
  gates** — approval happens at PR review before merge.

---

## The `/implement-issue` flow (interactive)

```
/implement-issue <issue-number> [--explore] [--skip-review] [--skip-qa] [--worktree]
```

| Stage | Interactive? | What happens |
|---|---|---|
| 0 Setup | — | Reads the issue; confirms it follows the Feature template. |
| 1 Clarify | ✅ gate | If ambiguous, uses `grilling` to resolve it; posts a clarifications comment. Skips if crisp. |
| 2 Explore | — | *(only with `--explore`)* dispatches `explorer` for a structured plan. |
| 3 Approve | ✅ gate | Presents the approach; waits for your go-ahead. |
| 4 Build | — | `feature-builder` → branch `feature/<n>`, commits, PR, report comment. |
| 5 Review | — | *(unless `--skip-review`)* `code-reviewer` → review comment + verdict. |
| 6 QA | — | *(unless `--skip-qa`)* `qa-engineer` → device QA comment + verdict. |
| 7 Fix-loop | — | If blocking findings, `feature-builder` fixes once (fix mode), then re-verifies. **Cap = 1**; still failing → hands back to you. |
| 8 Report | — | Summarizes PR URL, verdicts, anything needing attention. Never merges. |

### Flags
- `--explore` — dedicated exploration pass before the plan (worth it for larger changes).
- `--skip-review` / `--skip-qa` — skip a verify stage when not needed.
- `--worktree` — run code-touching agents in isolated git worktrees so humans can keep editing
  the main checkout. Note: a fresh worktree has no `node_modules`/native build → the QA stage
  may need a cold build.

### The PR contract
- **Title:** meaningful. **Body:** empty (other GitHub reviewer automation overwrites it).
- **First comment:** the feature-builder report. **Further comments:** the review and QA reports.

---

## Unattended runs — the `implement-issue-auto` workflow

The non-interactive twin of `/implement-issue`. It reuses the same subagents but orchestrates
them deterministically in code, with schema-validated verdicts and a hard fix-loop cap. It has
**no clarify/approve gates** — it assumes a complete, pre-approved issue (author it with
`write-issue`); approval happens at PR review before merge.

Invoke it as a workflow (opt-in), passing args:

| arg | default | meaning |
|---|---|---|
| `issue` | — (required) | the GitHub issue number |
| `review` | `true` | run the code-review stage |
| `qa` | `false` | run device QA (**opt-in** — agent-device is fragile unattended) |
| `worktree` | `false` | isolate code-touching agents in git worktrees |
| `maxFix` | `1` | max auto-fix rounds (hard counter; raise for more) |

Returns `{ prUrl, reviewVerdict, qaVerdict, fixAttempts, passed, outstanding }`.

Use it for crisp, well-specified issues; use interactive `/implement-issue` for uncertain or
exploratory ones.

---

## How to use it

1. `write-issue` (or open a Feature-template issue by hand) → a complete issue with Description +
   Acceptance criteria.
2. Implement it:
   - **Interactive:** `/implement-issue <n>` (add `--explore` for larger features). Answer any
     clarifying questions, approve the approach.
   - **Unattended:** run the `implement-issue-auto` workflow with `{ issue: <n> }` (add
     `qa: true` to include device QA).
3. Review the resulting PR — the feature-builder, review, and QA reports are in its comments.
4. Merge when satisfied. The pipeline never merges for you.
