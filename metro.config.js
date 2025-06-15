const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

// -----------------------------------------------------------------------------
// Firebase / Expo SDK 53: allow ".cjs" files and use classic Node "exports"
// resolution so Firebase sub‑packages are bundled correctly.
// -----------------------------------------------------------------------------
if (!defaultConfig.resolver.sourceExts.includes('cjs')) {
  defaultConfig.resolver.sourceExts.push('cjs');
}

// Disable the new, stricter "package.json exports" resolution until every
// dependency (Firebase, React‑Native‑WebView, etc.) ships full export maps.
defaultConfig.resolver.unstable_enablePackageExports = false;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
