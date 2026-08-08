const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('node:path');

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname);

  const { transformer, resolver } = config;

  // react-native-svg-transformer Expo configuration
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  // `enabled: false` makes Metro strip Storybook from the bundle, which is what keeps it out of
  // production builds. Do not weaken this flag.
  return withStorybook(config, {
    enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
    configPath: path.resolve(__dirname, './.rnstorybook'),
  });
})();
