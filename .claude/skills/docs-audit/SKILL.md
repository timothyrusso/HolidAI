---
name: docs-audit
description: Read-only audit of the project's documentation and `.claude/` configuration for staleness against the current codebase. Produces a report of what's outdated (stale / suspect) with the file and the fix. Use to check whether the agents, skills, workflows, CLAUDE.md, and wiki docs still match reality.
---

# docs-audit — is the documentation still true?

**Read-only.** You produce a **report**; you never modify a file.

Documentation and config drift as code changes — a renamed file, a removed npm script, a rule
now enforced differently, a workflow stage that no longer matches its skill. Your job: check
whether the project's operational config and docs still match the actual codebase, and report
what's stale. Catch both **structural** drift (broken references) and **semantic** drift (the
prose describes behaviour the code no longer has).

## What to audit
- `.claude/agents/*.md` — the subagents
- `.claude/skills/*/SKILL.md` — the skills (including this one)
- `.claude/workflows/*.js` — the workflows
- `.claude/CLAUDE.md`, `.claude/settings.json`
- `.github/ISSUE_TEMPLATE/feature.yml`, `.github/workflows/*.yml`
- `wiki/docs/*.md` and `README.md`

## Checks

**Structural** — confirm each referenced thing still exists:
- Repo paths in the operational config (e.g. `wiki/docs/ARCHITECTURE.md`, `features/...`) → the file exists.
- `npm run <script>` references → the script exists in `package.json`.
- `agentType` / `subagent_type` names → a matching `.claude/agents/<name>.md` exists.
- Referenced skills → the `.claude/skills/<name>/` exists.
- Tools assumed present (agent-device, gh, depcruise) → still wired into the project.

**Semantic** — does the prose still match the code/config?
- CLAUDE.md rules vs actual enforcement (`biome.json`, `eslint.config.js`, `.dependency-cruiser.js`, `lefthook.yml`) — is a rule the docs claim is enforced still backed by a real rule/hook?
- The `AGENTIC_WORKFLOW.md` "what's enforced" table vs the real linters/hooks.
- The pipeline stages in `AGENTIC_WORKFLOW.md` vs the actual `implement-issue` skill and `implement-issue-auto` workflow.
- The layer/folder model in `ARCHITECTURE.md` vs the real `features/` structure.
- The issue-template headings vs the headings the agents actually parse (`### Description`, `### Acceptance criteria`).

## Critical exclusion
`ARCHITECTURE.md` and `ERROR_HANDLING.md` use **intentionally fake example paths**
(`features/items/Item.ts`, etc.) — the docs say so explicitly. **Never flag an illustrative
example path as broken.** Only check references the operational config actually depends on, and
the docs' factual claims about how the project works.

## Discipline
- Read-only — never edit. Ground every finding in a real file/line or command output; verify a
  path with Read/Glob before calling it broken.
- Distinguish **definitely wrong** from **worth checking** — don't cry wolf.

## Output — a report
```markdown
## 📋 Docs & config audit

### 🔴 Stale — definitely wrong
- `path:line` — <what's wrong> → <fix>

### 🟡 Suspect — worth a human check
- `path` — <the concern>

### 🟢 Checked & current
- <one-line summary of what was verified and found consistent>

### Summary
- <counts + the one or two things most worth fixing first>
```

End with a one-line caveat: this is a point-in-time reasoning audit, not a guarantee — it flags
likely staleness for human review.
