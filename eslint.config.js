const { defineConfig } = require('eslint/config');
const reactCompiler = require('eslint-plugin-react-compiler');
const tsParser = require('@typescript-eslint/parser');
const holidai = require('./tools/eslint');

module.exports = defineConfig([
  {
    ...reactCompiler.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Do not use `enum`. Use a `const` object with `as const` instead (see wiki/docs/ARCHITECTURE.md).',
        },
        {
          selector: 'TSAsExpression[typeAnnotation.typeName.name="Error"]',
          message:
            'Do not cast `as Error`. Use `ensureError()` from features/core/error (see wiki/docs/ERROR_HANDLING.md).',
        },
      ],
    },
  },
  {
    // ViewModel contract rules — see tools/eslint. Registered at `warn` during rollout (issue #403);
    // flipped to `error` once every ViewModel is migrated (issue #404).
    files: ['**/*.logic.ts'],
    plugins: { holidai },
    rules: {
      'holidai/viewmodel-return-shape': 'warn',
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: { holidai },
    rules: {
      'holidai/prefer-viewmodel': 'warn',
    },
  },
  {
    // tools/ is build-time tooling (like scripts/) — not linted with app rules.
    ignores: ['dist/*', 'convex/_generated/*', '.claude/workflows/**', 'tools/**'],
  },
]);
