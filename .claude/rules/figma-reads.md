# Figma MCP read-tool policy (HARD RULE)

**Why:** this Figma account is on the **Starter** plan with a **View seat**. The Figma MCP
rate-limits *data-reading* tools to **~6 calls per MONTH**. Write tools (`use_figma`) are
**exempt** from that limit. Burning the 6 reads is easy and expensive, so reads are gated.

## The rule

- **Never call a Figma MCP read/data tool** unless **both** are true:
  1. It is genuinely **mandatory** — the only way to proceed, and it **cannot** be done via a
     read-only `use_figma` script; **and**
  2. The user has given **explicit permission for that specific call** in the conversation.
- Otherwise: **do not call them, and do not attempt to call them.**
- Default path for ALL Figma inspection/verification is **`use_figma`** (exempt write tool):
  run read-only JS that `return`s node data, and use inline `node.screenshot()` — never the
  standalone read tools — to understand or verify a file.

## Gated tools (require approval — also enforced in `.claude/settings.json` `permissions.ask`)

`get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`,
`get_code_connect_map`, `get_code_connect_suggestions`, `get_context_for_code_connect`,
`get_libraries`, `get_figjam`, `get_motion_context`, `get_shader_effect`, `get_shader_fill`,
`list_shader_effects`, `list_shader_fills`, `list_file_components_for_code_connect`,
`search_design_system`
(all under the `mcp__plugin_figma_figma__` prefix).

## NOT gated by settings — but NOT free either (learned 2026-07-21)

`use_figma`, `create_new_file`, `whoami` are not in the `ask` gate, and `use_figma` remains the
default path for all inspection/verification. **However, `use_figma` proved to be plan-rate-limited
too**: on 2026-07-21 it returned *"You've reached the Figma MCP tool call limit on the Starter
plan"* after ~20 calls across 3 days. Reset cadence unknown (doc mentions per-minute + daily or
monthly caps). Therefore:

- Treat **every** Figma MCP call as scarce. **Batch aggressively** — combine inspect + build +
  inline screenshot into one script per call whenever possible; never split work that can be atomic.
- Prepare and validate everything OFF-Figma first (HTML preview on Desktop → user validates →
  one batched write).
- If a call returns the rate-limit error, STOP calling Figma tools and tell the user; retrying
  burns nothing but adds noise — test again only after a plausible reset (next day / next month)
  or after a plan upgrade.

## Enforcement

- **Hard gate:** `.claude/settings.json` → `permissions.ask` forces an approval prompt before any
  gated tool runs (the harness enforces this; it does not depend on my compliance).
- **Behavioral:** this rule instructs me not to even reach for them unless mandatory + permitted —
  so no approval prompts appear in normal work.
