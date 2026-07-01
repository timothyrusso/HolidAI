---
name: grill-deck
description: Harvest transferable engineering concepts and design rationale from the CURRENT session's transcript and write them as self-contained study flashcards to flashcards.md in the project root. Use only when the user explicitly runs /grill-deck (typically right before closing a session) to turn what was learned into a spaced-repetition deck.
---

# grill-deck

Mine **this session's full transcript** for durable, transferable engineering knowledge and append it as flashcards to `flashcards.md` in the project root.

This is a deliberate, user-invoked action — run it only when the user calls `/grill-deck`. It reads the verbatim session log from disk (not just what's in context) so nothing lost to compaction is missed.

## What makes a good card (the bar)

Capture two things, and only these two:

1. **Transferable concepts** — a pattern, algorithm, language/framework behavior, or gotcha that applies *beyond this repo*.
2. **Design / architecture rationale** — *why* a trade-off or approach was chosen over alternatives, abstracted away from this codebase.

Include solid fundamentals when they genuinely came up — do **not** gate on novelty. But respect these hard rules:

- **Exclude tooling/CLI tricks** (git/jq/find incantations) and **project-specific trivia** (file paths, this app's module names, internal conventions). If it isn't useful to a stranger in a different codebase, it's not a card.
- **Never pad.** There is no target count. If the session taught nothing transferable, write **zero cards** and say so plainly. A short honest result beats filler.
- **Fully self-contained.** No "we", "this session", "our repo", "the ticket". Each card must be studyable cold, weeks later, by someone who wasn't here. Name the relevant technology/concept where needed (e.g. "React reconciler", "Hermes") — that's specificity, not session-coupling.

**Bad:** `Q: Why did our DealsHub search hang?`
**Good:** `Q: In React Native, why can an async bridgeless call still block the JS thread?`

## Step 1 — Extract the session content

The current session's transcript is a JSONL file named after `$CLAUDE_CODE_SESSION_ID`. Locate it portably and extract only the high-signal material (user turns + assistant `thinking`/`text`), stripping bulky raw tool I/O. Run:

```bash
python3 - <<'PY'
import os, json, glob, sys

cfg = os.environ.get("CLAUDE_CONFIG_DIR") or os.path.expanduser("~/.claude")
sid = os.environ.get("CLAUDE_CODE_SESSION_ID", "")
matches = glob.glob(f"{cfg}/projects/**/{sid}.jsonl", recursive=True)
if not matches:
    print("NO_TRANSCRIPT_FOUND", file=sys.stderr); sys.exit(1)

out = []
for line in open(matches[0]):
    try:
        d = json.loads(line)
    except Exception:
        continue
    t = d.get("type")
    m = d.get("message")
    if t == "user" and isinstance(m, dict):
        c = m.get("content")
        if isinstance(c, str) and c.strip():
            out.append("### USER\n" + c.strip())
    elif t == "assistant" and isinstance(m, dict):
        c = m.get("content")
        if isinstance(c, list):
            for b in c:
                if not isinstance(b, dict):
                    continue
                if b.get("type") == "thinking" and b.get("thinking", "").strip():
                    out.append("### THINKING\n" + b["thinking"].strip())
                elif b.get("type") == "text" and b.get("text", "").strip():
                    out.append("### ASSISTANT\n" + b["text"].strip())
                # tool_use / tool_result blocks (raw I/O) are intentionally dropped

dst = os.path.join(os.environ.get("TMPDIR", "/tmp"), f"grilldeck-{sid}.md")
open(dst, "w").write("\n\n".join(out))
words = sum(len(x.split()) for x in out)
print(f"Wrote {dst}  ({len(out)} blocks, ~{words} words)")
PY
```

Then **Read** the file it prints.

- If extraction prints `NO_TRANSCRIPT_FOUND`, stop and tell the user the transcript couldn't be located (they may be on a non-standard setup); do not fabricate cards from memory.
- If the file is very large (roughly > 40k words), read and analyze it in sequential chunks, accumulating candidate concepts as you go, rather than truncating.

## Step 2 — Identify candidate concepts

Read the extracted content in full. List every distinct idea that clears the bar defined in "What makes a good card". Merge near-duplicates into one concept. Discard anything project-specific, tooling-mechanical, or session-coupled. It is normal for a long session to yield only a few — or none.

## Step 3 — Dedup against the existing deck

If `flashcards.md` already exists in the project root, read it first. For each candidate, **skip it if the concept is already covered** — match on *meaning*, not exact wording. Only genuinely new concepts proceed.

## Step 4 — Write the cards

Append surviving cards to `flashcards.md` in the project root (create it if absent), preserving anything already there. Use exactly this format, one card per concept:

```
### Q: <a general, self-contained question>

- <answer point>
- <answer point, if needed — a single bullet is fine>

---
```

Keep answers concise: bullet points, no prose paragraphs. One bullet is acceptable; multiple only when the concept genuinely needs them.

## Step 5 — Report

Tell the user how many new cards were appended and list their questions. If none qualified, say so directly and explain briefly why (e.g. "this session was mechanical fixes with no transferable concepts") — this is a valid, expected outcome, not a failure.
