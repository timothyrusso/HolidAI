# qa-web-engineer memory — operational lessons

Read at the start of every web QA run. Append only under the rules in
`.claude/agents/qa-web-engineer.md`. Humans curate at PR review — entries can be deleted.

## Known environment

- Node 22.20.0 is confirmed installed here: `source ~/.nvm/nvm.sh && nvm use 22.20.0` is the
  fix when the shell node is below `engines.node`.
- `npm run storybook` serves web Storybook on port 6006, built with Vite +
  react-native-web.

## Lessons

- [2026-08-08] Why driving Chrome with `agent-device --platform macos` fails (it was tried
  before this agent existed): Chrome loses frontmost focus between commands so presses land
  on the wrong window, and `snapshot -i` only ever sees the "Agent Device Runner" helper
  window, never page content.
- [2026-08-08] Web Storybook stories that use `react-native-reanimated` need the reanimated
  Babel plugin wired into the Vite config; without it stories throw "`useAnimatedStyle` was
  used without a dependency array or Babel plugin" and fail to render at all. If a story
  renders a hard error rather than the component, check the Storybook Vite Babel config
  before reporting a component bug.
