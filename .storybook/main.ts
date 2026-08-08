import type { StorybookConfig } from '@storybook/react-native-web-vite';

// Same glob as `.rnstorybook/main.ts`: one set of co-located story files feeds both runtimes.
// The framework bundles `vite-tsconfig-paths`, so the `@/*` alias resolves straight from
// `tsconfig.json` with no extra Vite configuration.
const main: StorybookConfig = {
  stories: ['../features/**/*.stories.?(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      // Ships untranspiled RN sources, so Vite has to run it through the RNW transform.
      modulesToTranspile: ['@react-native-vector-icons'],
      pluginReactOptions: {
        babel: {
          // `CustomPressable` (rendered by every button) calls `useAnimatedStyle`, which throws on
          // web unless Reanimated's Babel plugin has turned the callback into a worklet. Metro gets
          // it from `babel-preset-expo`; Vite has no Babel config of its own here (the framework
          // sets `babelrc: false` / `configFile: false`), so the plugin is wired up explicitly.
          // Reanimated 4 re-exports it from `react-native-worklets`, which owns it.
          plugins: ['react-native-worklets/plugin'],
        },
      },
    },
  },
  typescript: {
    // `CustomButtonProps` / `CustomIconButtonProps` are type aliases imported into the component
    // files; only the TypeScript-aware docgen resolves them into a props table.
    reactDocgen: 'react-docgen-typescript',
  },
};

export default main;
