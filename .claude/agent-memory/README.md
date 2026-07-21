# Agent memory

Committed, per-agent operational memory. Each file here belongs to one `.claude/agents/`
agent, which reads it at the start of a run and may append one-line lessons under the
strict rules defined in its own agent definition.

**Curation model:** new or changed entries land as part of a feature PR (e.g. a
`chore(<issue>): qa lesson — <slug>` commit) and get reviewed like any other change —
the human keeps what is useful and deletes slop. There is no automated curation.

**What belongs here:** reusable operational knowledge — tooling quirks, device behavior,
environment facts, timings — that would otherwise be re-learned (and re-paid for) on
every run.

**What never belongs here:** app-behavior findings (those go in issues/PR comments),
anything already stated in the agent's own definition, credentials or secrets, and
speculation. One line per entry; update or delete existing entries rather than
duplicating them.
