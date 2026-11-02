/**
 * The Sentry SDK as a test sees it: every call a no-op. The real module starts a cleanup interval
 * when it loads, which keeps jest from exiting, and the core public APIs load it through
 * `core/sentry`. A test that needs to see what was reported provides a fake `Sentry` Layer.
 */
const noop = () => undefined;
const span = { end: noop, setStatus: noop };

module.exports = {
  init: noop,
  captureException: noop,
  setMeasurement: noop,
  wrap: <C>(component: C): C => component,
  startSpan: <T>(_options: unknown, callback: () => T): T => callback(),
  startInactiveSpan: () => span,
  mobileReplayIntegration: () => ({}),
  reactNavigationIntegration: () => ({ registerNavigationContainer: noop }),
};
