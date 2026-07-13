---
name: write-issue
description: Author a complete, well-specified GitHub feature issue by interviewing the user until the Description and Acceptance criteria are unambiguous, then create it with the Feature-template structure. Use when starting a new feature from a rough idea — it front-loads clarification so /implement-issue and the implement-issue-auto workflow can trust the issue.
argument-hint: "[rough idea or title]"
---

# write-issue — author a complete, ready-to-implement feature issue

Your goal: turn a rough idea into a GitHub issue so clear and complete that an agent can
implement it with no further questions. This front-loads the clarification that would
otherwise happen at implementation time — so the downstream pipeline can trust the issue.

The rough idea (if any) is in `$ARGUMENTS`. If it's empty, ask the user what they want to build.

## Process

1. **Interview the user with the `grilling` skill.** Stress-test the idea until you can answer,
   without guessing: what exactly is being built, the expected behaviour, the edge/negative
   cases, which screens/features it touches, what is explicitly out of scope, and how you'd
   verify each outcome on a device. Keep going until the acceptance criteria are concrete and
   testable — not vague ("works well") but observable ("tapping X navigates to Y").

2. **Draft the issue** using the **exact** Feature-template headings (so `/implement-issue` and
   the workflow parse it identically). Use this structure:

   ```markdown
   ### Description
   <what the feature does, expected behaviour, constraints — specific and self-contained>

   ### Acceptance criteria
   - [ ] <observable, verifiable outcome — testable on the device>
   - [ ] ...

   ### Screens affected
   <e.g. SavedTrips, DestinationSearch — or omit if none>

   ### Out of scope
   - <anything explicitly excluded — or omit>

   ### Design link
   <URL — or omit>
   ```

3. **Review with the user.** Show the draft; iterate until they approve. Do not pad criteria
   or invent scope — reflect what the user actually confirmed.

4. **Create the issue only after explicit approval** (it's an outward action). Match the
   template's title prefix and label:
   ```
   gh issue create --title "[Feature]: <concise title>" --label enhancement --body-file <file>
   ```

5. **Report** the created issue number and URL, and suggest the next step:
   `/implement-issue <n>` (interactive) or the `implement-issue-auto` workflow (unattended).

## Rules
- Acceptance criteria must be **testable** — each one is a QA test case later.
- Keep the Description self-contained: the implementer builds from it alone.
- Never create the issue without the user's explicit go-ahead.
