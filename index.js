// App entry point. Boots Storybook instead of the app only when EXPO_PUBLIC_STORYBOOK_ENABLED
// is set (see the `storybook:ios` / `storybook:android` scripts). Without the flag, Metro is
// configured to strip Storybook from the bundle entirely, so the branch below is dead code in a
// production build (see metro.config.js).
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  // `@storybook/react-native` only builds the UI component; unlike `expo-router/entry` it never
  // touches `AppRegistry`, so the root component has to be registered here or the app boots to
  // "Application 'main' has not been registered".
  const { registerRootComponent } = require('expo');

  registerRootComponent(require('./.rnstorybook').default);
} else {
  require('expo-router/entry');
}
