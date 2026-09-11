import type { StorybookConfig } from '@storybook/react-native-web-vite';
import type { PluginOption } from 'vite';

// NOTE: `@react-native-vector-icons` declares its font as `require('....ttf')` at module scope even
// in its ESM build, a Metro-ism Vite emits verbatim: the browser then throws `require is not defined`
// while evaluating the module, so every story that reaches `CustomIcon` renders blank. Rewriting the
// call to a real asset import is what keeps the built Storybook working.
const nativeFontRequire: PluginOption = {
  name: 'holidai:native-font-require',
  enforce: 'pre',
  transform(code: string, id: string) {
    if (!id.includes('@react-native-vector-icons') || !/require\((['"])[^'"]+\.ttf\1\)/.test(code)) {
      return null;
    }

    const imports: string[] = [];
    const transformed = code.replace(/require\((['"])([^'"]+\.ttf)\1\)/g, (_match, _quote, request: string) => {
      const binding = `__holidaiFont${imports.length}`;
      imports.push(`import ${binding} from '${request}';`);
      return binding;
    });

    return { code: `${imports.join('\n')}\n${transformed}`, map: null };
  },
};

const main: StorybookConfig = {
  stories: ['../features/**/*.stories.?(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      modulesToTranspile: ['@react-native-vector-icons'],
      pluginReactOptions: {
        babel: {
          // HACK: the Reanimated Babel plugin is wired up by hand because the framework sets
          // `babelrc: false` / `configFile: false`, so Vite has no Babel config of its own here and
          // `useAnimatedStyle` (called by every button through `CustomPressable`) throws on web
          // without it. Reanimated 4 re-exports the plugin from `react-native-worklets`.
          plugins: ['react-native-worklets/plugin'],
        },
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: config => {
    config.plugins = [nativeFontRequire, ...(config.plugins ?? [])];
    return config;
  },
};

export default main;
