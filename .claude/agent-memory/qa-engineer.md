# qa-engineer memory — operational lessons

Read at the start of every QA run. Append only under the rules in
`.claude/agents/qa-engineer.md`. Humans curate at PR review — entries can be deleted.

## Known environment

- agent-device version last verified: 0.20.8 (2026-08-13)
- Project requires Node >=22.13 (package.json engines); default `nvm` shell node can be older
  (e.g. 22.11.0) and silently breaks Metro/CLI tooling with errors that look like code bugs.
  Check `node --version` vs `engines.node` first; `nvm use 22.20.0` fixes it.

## Lessons

- [2026-07-21] Layered-Animated / gesture-drawn controls can misreport as non-hittable in
  accessibility snapshots — verify via react-devtools or an actual interaction result before
  recording a FAIL for "element not tappable".
- [2026-07-24] Post-login screens: sign in with `QA_TEST_EMAIL` (`+clerk_test`) + OTP `424242`
  (Clerk `pk_test` dev instance only). Pre-filled "Last Used" identifier may default to a
  PASSWORD prompt — tap "Use another method" → "Email code to <address>" first. Any test that
  signs out must sign back in before finishing.
- [2026-08-08] `agent-device devices --json` can list a physical iOS device as `booted:true`
  even when disconnected. Confirm reachability with a cheap `open <bundleId> --device "<Name>"`
  before committing to it.
- [2026-08-08] Driving Chrome via `agent-device --platform macos` loses frontmost focus between
  commands and `snapshot -i` only ever sees the runner window, never page content (the web-scope
  rule itself is in the agent definition).
- [2026-07-24] `agent-device metro reload` can 500 even with Metro healthy — fall back to
  `open <app> --device <name> --relaunch`.
- [2026-07-25] Long RN ScrollViews: `scroll down/up/top` are unreliable. Prefer manual
  `swipe <x> <y1> <x> <y2>` drags (~300-500px) + `screenshot` after each.
- [2026-07-25] For accessibilityLabel checks collapsed into one composite AT button, use
  `react-devtools find <Component>` then check an unmerged instance elsewhere on-device.
- [2026-08-13] Metro's transform cache can serve a stale inlined `EXPO_PUBLIC_*` value across
  unrelated prior runs even though the var is correctly exported now (symptom: wrong entry
  branch boots, e.g. normal app instead of Storybook). Restart Metro with `--clear` before the
  first launch on a device whenever such a flag gates the entry point.
- [2026-08-13] The on-device "Bundling NN%…" overlay can stay stuck on screen after Metro
  already logged the bundle complete — screenshots alone look hung. Verify with `snapshot -i`
  (reflects real content) before concluding the app is stuck.
- [2026-08-16] `agent-device devices --json` reports a simulator by name; the numeric `id`/UUID is
  rejected by `apps`/`open` on 0.20.8 even for the booted one — pin with the simulator `name`
  instead when only one instance of that name is booted.
- [2026-08-16] Android emulator (`Medium_Phone_API_36.1`) crashed mid-session twice and the dev
  client kept retrying a stale cached manifest host (`192.168.1.171:9090`, unrelated to this
  machine) instead of the URL typed into "Connect" — `adb shell pm clear` + fresh
  `am start -a android.intent.action.VIEW -d exp+holidai://...` didn't fix it either. Budget
  Android-specific criteria as at-risk; don't sink QA time past ~2 retries.
- [2026-08-16] `expo run:android --device <x>` wants the AVD name itself (e.g.
  `Medium_Phone_API_36.1`), not the adb `model:` field nor the adb serial.
- [2026-08-21] Physical Android dozes (`mWakefulness=Dozing`, black screencap) ~1s after WAKEUP +
  `wm dismiss-keyguard`; try `adb shell svc power stayon usb`, else call it broken after ~2 tries.
- [2026-08-21] `agent-device press` coordinates are two positional args (`press 20 819`), not a
  quoted "x,y"/"x y" string. On-device Storybook's own sidebar/story-list rows and its bottom
  hamburger/fullscreen icons are sparse in the AX tree — screenshot, eyeball pixel coords, then
  `press <x> <y>`; re-snapshot after the sheet closes since it clears refs.
- [2026-08-22] `.env`/`QA_TEST_EMAIL` can be unreadable (permission classifier blocks `cat`/`grep`/`source`
  even when not literally denied) — when auth-gated criteria are unreachable, design-system criteria are
  often still testable via on-device Storybook with no rebuild: kill Metro, restart with
  `EXPO_PUBLIC_STORYBOOK_ENABLED=true npx expo start --clear`, relaunch the already-installed app.
- [2026-08-22] `xcrun simctl io recordVideo` output is VFR — sequential `ffmpeg` frame dumps are unevenly
  spaced in real time, so naive frame-by-frame diffing false-alarms as animation "hitches". Pull
  `ffprobe -show_entries frame=pts_time` first and pick frames at even real-time deltas before judging
  smoothness.
- [2026-08-22] This app's real bundle id is `com.app.travelplanner` (app.json), not `com.holidai` —
  `agent-device open com.holidai` fails with "app bundle is not installed" even right after a
  successful build; check `app.json`/`xcrun simctl listapps` when open fails post-build.
- [2026-08-22] A concurrent QA lane (e.g. web-qa) can hold the default `agent-device` session on
  the preferred simulator (`DEVICE_IN_USE`/stale `default` session) and leave a stray Metro bound
  to the same checkout with a different env (e.g. `EXPO_PUBLIC_STORYBOOK_ENABLED=true`) — boot a
  spare simulator under your own `--session <name>` ONLY after a real `DEVICE_IN_USE` failure; a
  merely booted simulator is usually a previous round's leftover, so reuse it (a spare costs a
  full cold build). Always verify/restart Metro rather than trusting whatever's already
  listening on 8081.
- [2026-08-24] To test Reanimated animate-vs-jumpcut (incl. `useReducedMotion`) without a UI
  slider ref in the AX tree, use on-device Storybook's Controls-panel "reset" icon (top-right
  of the Controls panel, un-labeled in AX) to force a value jump, wrapped in
  `xcrun simctl io <udid> recordVideo`; `ffprobe -show_entries frame=pts_time` reveals dense
  frame bursts precisely where the fill is mid-transition — extract/crop those frames to see
  gradual vs instant width change. Toggle reduce-motion via
  `xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool true`
  + app relaunch (simctl has no dedicated `ui reduce_motion` subcommand).
- [2026-08-24] iOS's own AX percentage text for `accessibilityValue={{min,max,now}}` renders as
  `now/(max-min)` (not `(now-min)/(max-min)`) — e.g. min=1,max=10,now=1 shows "11%", now=10 shows
  "111%", and max===min shows "+∞". This is a platform quirk of the value the device exposes as
  text, not a component bug; don't flag it as broken without checking the min/max/now match spec.
- [2026-09-09] `expo run:ios --device <id>` with an env flag (e.g. `EXPO_PUBLIC_STORYBOOK_ENABLED=true`)
  silently reuses an already-running Metro on 8081 from an unrelated process instead of starting
  its own — the flag never takes effect. After the native build finishes, start your own
  `expo start --clear --port <other>` with the flag and `xcrun simctl openurl <udid>
  "exp+<scheme>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A<port>"` to point the
  installed binary at it.
- [2026-09-09] `xcrun simctl io recordVideo` can capture a stuck/stale frame (e.g. a control that
  never visually updates for the whole clip, or a garbled "pinwheel" render) while the app's real
  state and direct `screenshot` calls are correct throughout — a capture desync, not a repro.
  Never conclude a visual bug from `recordVideo` frames alone; cross-check with 2-3 direct
  `screenshot` calls at the same moment before reporting it.
- [2026-09-09] A stuck `SplashScreenLogo` overlay can persist across relaunches in BOTH the AX
  tree and actual `screenshot`/`simctl io screenshot` pixels (not just an AX-only false read like
  the "Bundling%" case) — a simulator compositor glitch, not a real splash-hide bug. Fix with
  `xcrun simctl shutdown <udid> && xcrun simctl boot <udid>`, not more relaunches.
- [2026-09-09] The on-device Storybook sidebar toggle can go transiently unresponsive to taps at
  its known coordinates after heavy interaction (picker dropdowns, rapid nav) with no AX/visual
  change and no error — not a hang. `open <app> --session <s> --relaunch` recovers it; don't sink
  retries into re-tapping the same spot.
