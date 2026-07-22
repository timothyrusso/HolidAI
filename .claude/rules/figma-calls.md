# Figma MCP policy — ALL calls gated, ONE call per update (HARD RULE)

**Why:** this Figma account (`holidai.ai@gmail.com`, Starter plan, View seat) has a hidden
plan-level quota on **every** MCP tool call — including the write tool `use_figma` (blocked
2026-07-21 after ~20 calls over 3 days; best-fit model: rolling budget of ~20 calls per few days).
Every call is scarce and must be spent deliberately by the user, never autonomously.

## Rule 1 — every call needs explicit approval

- **No Figma MCP tool may be called without the user's explicit go-ahead for that specific call.**
  This covers ALL tools under `mcp__plugin_figma_figma` — reads (`get_metadata`,
  `get_design_context`, `get_screenshot`, …), writes (`use_figma`, `create_new_file`,
  `upload_assets`, `generate_figma_design`, …), and even `whoami`. No exceptions.
- Before asking, state plainly: what the single call will do, and why one call suffices.
- Enforced twice: (a) `.claude/settings.json` → `permissions.ask` gates the whole server
  (`mcp__plugin_figma_figma`) plus every known tool explicitly; (b) this rule instructs the agent
  never to even attempt a call without asking in conversation first.

## Rule 2 — one single call per update

- Every Figma update must be completed in **exactly one `use_figma` call**, no matter how complex.
  The script must batch EVERYTHING: any needed inspection, all mutations, frame resizing, and the
  inline `node.screenshot()` verification — in that same single script.
- Never split into inspect-call + build-call, and never make a separate verification call.
- **If a script fails** (calls are atomic — a failed script changes nothing), do NOT retry
  automatically: report the error and ask before any second call.
- **If one call is physically impossible** (the `use_figma` script has a 50,000-character limit —
  e.g. embedding many base64 images may exceed it), say so BEFORE doing anything and let the user
  decide (approve N calls, or trim scope).

## Rule 3 — prepare everything off-Figma first

Standard workflow: build an **HTML preview** (Desktop file, zero Figma calls) → the user validates
and iterates on it → only then ask approval for the single porting call. All design decisions are
settled before any quota is spent.

## Quota facts (empirical)

- Starter caps are opaque; observed ≈20 calls per rolling few days, partial daily recovery.
- Budget ≤5–10 calls/day; a dozen in one day starves the next.
- On a rate-limit error: stop entirely, inform the user, test again the next day.
