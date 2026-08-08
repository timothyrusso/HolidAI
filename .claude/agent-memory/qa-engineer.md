# qa-engineer memory — operational lessons

Read at the start of every QA run. Append only under the rules in
`.claude/agents/qa-engineer.md`. Humans curate at PR review — entries can be deleted.

## Known environment

- agent-device version last verified: 0.19.3 (2026-07-24)
- Project requires Node >=22.13 (package.json engines); default `nvm` shell node here can be
  older (e.g. 22.11.0) and silently breaks Metro/CLI tooling (ERR_REQUIRE_ESM loading
  metro.config.js, `storybook build` refuses to start) with errors that look like code bugs
  but aren't. Always check `node --version` vs `engines.node` before blaming the PR; `source
  ~/.nvm/nvm.sh && nvm use <compliant-version>` (22.20.0 confirmed installed) fixes it.

## Lessons

- [2026-07-21] Layered-Animated / gesture-drawn controls can misreport as non-hittable in
  accessibility snapshots — verify via react-devtools or an actual interaction result
  before recording a FAIL for "element not tappable".
- [2026-07-24] Post-login screens: if the shared sim is signed out, sign in with the
  `QA_TEST_EMAIL` env var (`+clerk_test` address) + OTP `424242` (Clerk `pk_test` dev
  instance). A plain email gets a real code and rejects `424242` — wrong identifier, not a
  broken account. If the identifier field is pre-filled ("Last Used"), Clerk may default to
  a PASSWORD prompt — tap "Use another method" → "Email code to <address>" first. Any test
  that signs out must sign back in before finishing.
- [2026-08-08] `agent-device devices --json` can list a physical iOS device as `booted:true`
  even when it's not actually connected (matches `xcrun devicectl list devices` showing
  "unavailable"). Confirm reachability with a cheap `agent-device open <bundleId> --platform
  ios --device "<Name>"` before committing to it.
- [2026-08-08] Do NOT QA web targets from this agent. Driving Chrome via `agent-device
  --platform macos` was tried and is unreliable (Chrome loses frontmost focus between
  commands so presses land on the wrong window; `snapshot -i` sees only the "Agent Device
  Runner" helper window, never page content). Web Storybook / `expo start --web` now belong
  to the `qa-web-engineer` agent, which uses `agent-browser`. Mark browser-only criteria
  BLOCKED and move on.
- [2026-08-08] FIXED — Xcode 26.6 could not compile RN 0.86's *prebuilt*
  `ReactNativeDependencies` pod (folly `New.h` aligned-new/aligned-delete mismatch, xcodebuild
  exit 65). Resolved by `ios.buildReactNativeFromSource: true` +
  `usePrecompiledModules: false` in the `expo-build-properties` plugin in `app.json`, which
  makes the Podfile set `RCT_USE_RN_DEP=0` / `RCT_USE_PREBUILT_RNCORE=0` so folly builds with
  the local toolchain. Xcode did NOT need downgrading. Cost: clean iOS builds are slower
  (RN compiles from source). If iOS builds ever fail this way again, check those flags
  survived a prebuild before blaming Xcode or the PR.
- [2026-07-24] `agent-device metro reload` can 500 even with Metro healthy/reachable —
  fall back to `open <app> --platform ios --device <name> --relaunch`.
- [2026-07-25] Long RN ScrollViews: `scroll down/up`/`scroll top` are unreliable (huge
  overshoot or silent no-op). Prefer manual `swipe <x> <y1> <x> <y2>` drags (~300-500px) +
  `screenshot` after each; `find "<text>" get attrs --json` gives `rect.y` to gauge distance.
- [2026-07-25] If Home shows "no trip planned" but the account has trips, check Profile →
  "Totale viaggi" → "Tutti i viaggi" (Home may show a filtered subset).
- [2026-07-25] For accessibilityLabel checks collapsed into one composite AT button, use
  `react-devtools find <Component>` to confirm the instance, then check an unmerged instance
  elsewhere (e.g. a details modal) as on-device proof of the rendered (translated) label.
