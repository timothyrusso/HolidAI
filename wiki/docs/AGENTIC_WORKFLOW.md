# Agentic workflow: HolidAI deltas

The issue-to-PR pipeline (`/write-issue`, `/implement-issue`, the pipeline workflow, `/triage-pr`,
the agents and the overnight runbook) is the agentic-kit plugin, documented in the kit's
[AGENTIC_WORKFLOW.md](https://github.com/timothyrusso/agentic-kit/blob/main/AGENTIC_WORKFLOW.md).
HolidAI no longer keeps its own copies of the agents, skills or workflow; agents are addressed as
`agentic-kit:<name>`. This file lists only what is HolidAI's own.

## Wiring

- The plugin `agentic-kit@agentic-kit` is enabled from the `agentic-kit` marketplace in
  `.claude/settings.json`, next to the deny list that blocks `--no-verify` and force pushes.
- Every HolidAI value the plugin needs (board ids, QA targets `mobile` and `web`, simulator,
  Metro port, the signed-in baseline with the Clerk test account) is in
  [`kit.config.json`](../../kit.config.json), as described in the kit's
  [`kit.config.json` section](https://github.com/timothyrusso/agentic-kit/blob/main/AGENTIC_WORKFLOW.md#1-kitconfigjson).
- The agents read the kit docs, then these deltas
  ([ARCHITECTURE.md](ARCHITECTURE.md), [ERROR_HANDLING.md](ERROR_HANDLING.md)) and
  [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md).

## HolidAI's own pieces

| Piece | Where | Role |
| --- | --- | --- |
| Agent memory | [`.claude/agent-memory/`](../../.claude/agent-memory/README.md) | Committed lessons for `qa-engineer` and `qa-web-engineer` (device quirks, the real bundle id, timings) |
| Triage bots | `.claude/triage-bots.json` | Overrides the plugin's list: CodeRabbit, Cubic, Sourcery |
| `open-pencil` skill | `.claude/skills/open-pencil` (link to `.agents/skills/open-pencil`) | Design work in OpenPencil, with its MCP server in `.mcp.json` |
| CodeGraph | `.mcp.json` and the `@colbymchenry/codegraph` dev dependency | Code-intelligence MCP; run `npx codegraph init` once to build the local `.codegraph/` index (gitignored) |

## CI around the pipeline

- `pr-checks.yml` is the kit's check job (commitlint, architecture with its marker comment,
  `npm run check`, the iOS bundle).
- `pull-request.js.yml` keeps HolidAI's Storybook and build jobs. The web Storybook of every PR
  that touches a Storybook path is published at
  `https://timothyrusso.github.io/HolidAI/pr-<number>/`; the pipeline never screenshots stories,
  and the web QA lane can target that build or `expo start --web`.
- `pr-artifacts-cleanup.yml` deletes a closed PR's `qa-evidence/pr-<number>` branch and its
  Storybook preview.
