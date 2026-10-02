const { defineConfig } = require('eslint/config');
const reactCompiler = require('eslint-plugin-react-compiler');
const tsParser = require('@typescript-eslint/parser');
const { loadKitConfig } = require('@timothyrusso/config-presets');
const { default: arch, DEFAULT_RELATIVE_IMPORT_ALLOW } = require('@timothyrusso/eslint-plugin-arch');

module.exports = defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.expo/**',
      'ios/**',
      'android/**',
      'convex/_generated/*',
      '.claude/workflows/**',
      '.rnstorybook/storybook.requires.ts',
    ],
  },
  ...arch.configs.recommended(loadKitConfig({ cwd: __dirname })),
  {
    ...reactCompiler.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    // NOTE: Convex bundles its functions on its own, without the `@/` alias, and the Storybook
    // entry imports the `storybook.requires` file Metro generates next to it, so both stay relative.
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: {
      'arch/no-relative-imports': [
        'error',
        { allow: [...DEFAULT_RELATIVE_IMPORT_ALLOW, 'convex', '.rnstorybook', 'index.js'] },
      ],
    },
  },
  {
    // NOTE: these rows pass an inline arrow to the row component. Night 4 (#505) moves the
    // handlers into the ViewModels and deletes this block.
    files: [
      'features/trip-generation/ui/components/TravelersNumberSelector/TravelersNumberSelector.tsx',
      'features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.tsx',
      'features/trip-generation/ui/pages/SelectTravelersPage/SelectTravelersPage.tsx',
    ],
    rules: {
      'arch/stable-row-handlers': 'warn',
    },
  },
]);
