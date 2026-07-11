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
    ignores: ['dist/*', 'convex/_generated/*', '.claude/workflows/**'],
  },
]);
