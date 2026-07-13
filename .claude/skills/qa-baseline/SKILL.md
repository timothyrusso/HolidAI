---
name: qa-baseline
description: The standing set of baseline QA checks to run for EVERY feature, regardless of what it does — regression/retrocompatibility safety net. Run these on the agent-device before any feature-specific acceptance-criteria tests. Use when doing manual QA on a feature branch.
---

# Baseline QA checks

These are the minimum checks that must pass for **every** feature, independent of the
feature itself. They guard against regressions and broken app health. Run them first,
then run the feature's own acceptance criteria.

## Environment

- Drive the app on the **agent-device** (callstack agent-device toolkit) — this is the
  required QA target for manual device tests. Do not use other device-control tooling.
- Assume the feature branch is checked out and the app is installed/buildable on the
  agent-device.

## Checks

### 1. App startup (critical regression flow)
Cold-launch the app on the agent-device.
- **Pass when:** the app reaches its main screen without crashing, no red-screen / fatal
  error, and no fatal errors in the logs during launch.
- **Fail when:** crash on launch, red screen, stuck splash, or a fatal error.
- Capture a screenshot of the launched main screen as evidence.

## Reporting

Report the baseline result as a section with, for each check: the verdict (✅ pass /
❌ fail), a one-line note, and the captured screenshot. If any baseline check fails, the
feature fails QA regardless of its acceptance criteria — state this clearly.
