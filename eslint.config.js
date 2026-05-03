const { defineConfig } = require('eslint/config');
const reactCompiler = require('eslint-plugin-react-compiler');
const tsParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  {
    ...reactCompiler.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ignores: ['dist/*', 'convex/_generated/*'],
  },
]);
