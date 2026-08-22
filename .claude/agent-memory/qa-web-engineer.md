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
- [2026-08-13] `agent-browser fill` on a range `<input type=range>` slider doesn't set the
  value reliably (it appended digits, e.g. 30+"60" -> 36). Use `focus @ref` then
  `press Home`/`press End`/arrow keys instead to hit min/max deterministically.
- [2026-08-13] React Native Web's `ScrollView` renders all children unvirtualized in the DOM
  on web, so `agent-browser eval "document.body.innerText"` on a story's iframe captures
  every off-screen cell's text in one call — faster than scrolling+screenshotting to verify
  full-list counts/ordering (used for the CustomIcon `AllIcons` catalogue, 44 cells).
- [2026-08-13] `agent-browser frame @eN` switches `snapshot`/`click` context into an iframe, but
  `eval --stdin` still runs against the top-level document regardless — use `snapshot` (not
  `eval`) to read text/DOM state inside a Storybook preview iframe.
- [2026-08-14] To test a specific Storybook arg combo (e.g. a disabled variant of a non-default
  control value) without clicking through the Controls panel, open
  `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story&args=key:value;key2:value2`
  directly — isolates the component (no sidebar/addons chrome) and sets args via the URL.
- [2026-08-16] React Native Web's `textTransform: uppercase` is CSS-only — searching
  `innerHTML` for the visible uppercase string never matches; the text node stays
  title-case. Assert on title-case text; read colours/geometry (bg, border, translateY,
  opacity, backdrop-filter) via `getComputedStyle` on the RNW divs instead of screenshots.
- [2026-08-19] Storybook's `.storybook/preview.tsx` wraps every story in a fixed-`maxWidth`
  phone-frame div (no inline style, a CSS class) — resizing the browser viewport does nothing
  to a `width: '100%'` DS component. To test container-width responsiveness, `eval` the
  component's `parentElement` and `style.setProperty('max-width', 'NNNpx', 'important')` (plain
  assignment loses to the class) directly, not the browser viewport.
- [2026-08-19] `agent-browser set media reduced-motion` (reset `no-preference`) emulates
  `prefers-reduced-motion` — tests Reanimated `useReducedMotion()` on web with no OS toggle.
- [2026-08-19] `agent-browser screenshot "<selector>"` crops to one element; to scope a shot over
  several, tag a shared ancestor with a throwaway `data-qa-*` attribute via `eval` first.
- [2026-08-21] `agent-browser screenshot` takes `--full` (not `--full-page`) for a full-page
  capture; an unrecognized flag is silently treated as the path, saving a file literally named
  after the flag in the cwd.
- [2026-08-21] Clicking a Storybook sidebar section button (`@eN`) to expand it is unreliable
  (ref doesn't re-render as expanded). Navigate straight to
  `http://localhost:6006/?path=/docs/<kebab-title>--docs` (or `/iframe.html?id=<story-id>` for a
  single story) instead — faster and deterministic.
- [2026-08-21] Viewport resize is `agent-browser set viewport <w> <h>` (under "Browser
  Settings" in `--help`), not `agent-browser viewport`; useful to force a small height and
  confirm scroll-to-bottom actually reaches the last off-canvas element (compare `scrollY +
  innerHeight` to `scrollHeight`) rather than trusting a single full-page screenshot.
- [2026-08-22] The console/network subcommands are `agent-browser console`, `agent-browser errors`,
  `agent-browser network requests` (there is no `logs` or bare `network`).
- [2026-08-22] react-native-web 0.21's `View` forwards only *flat* accessibility-value props: either
  the raw `aria-valuemin/max/now/text` (what this repo uses) or the deprecated
  `accessibilityValueMin/Max/Now/Text` aliases. RN's native object form
  `accessibilityValue={{min,max,now}}` (the correct cross-platform API) is silently dropped on web,
  so a determinate progressbar never gets `aria-valuenow` there. Verify via
  `getAttributeNames()` on the `role="progressbar"` element, not visual inspection alone.
- [2026-08-22] React Native Web's atomic CSS hashes a classname by exact style *value*, so any two
  elements anywhere in a story that share one numeric prop (e.g. `borderRadius: 6`) get the
  identical `r-borderRadius-<hash>` class regardless of component — `document.querySelectorAll`
  on that class (copy it from one already-inspected node) grabs every matching node across a
  story in one `eval` call, faster than deriving a selector per instance.
