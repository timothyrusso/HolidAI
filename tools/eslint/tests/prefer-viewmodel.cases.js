// @ts-check
'use strict';

// Standalone RuleTester spec for `prefer-viewmodel`. See viewmodel-return-shape.cases.js header.

const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const rule = require('../rules/prefer-viewmodel');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const TSX = 'SelectDatesPage.tsx';
const IMPORT = "import { useSelectDatesPageLogic } from '@/features/x/SelectDatesPage.logic';";

module.exports = function run() {
  ruleTester.run('prefer-viewmodel', rule, {
    valid: [
      // Calls only its own ViewModel hook, once.
      {
        filename: TSX,
        code: `${IMPORT}
        export const SelectDatesPage = () => {
          const { state } = useSelectDatesPageLogic();
          return null;
        };`,
      },
      // No `.logic` import => presentational component, exempt even if it calls hooks.
      {
        filename: TSX,
        code: `import { useState } from 'react';
        export const Dumb = () => { const [x] = useState(0); return null; };`,
      },
      // Allowlisted foreign hook is permitted.
      {
        filename: TSX,
        code: `${IMPORT}
        import { useGlassmorphism } from '@/features/core/ui';
        export const SelectDatesPage = () => {
          const { state } = useSelectDatesPageLogic();
          const cls = useGlassmorphism();
          return null;
        };`,
        options: [{ allow: ['useGlassmorphism'] }],
      },
    ],
    invalid: [
      // Calls a foreign hook alongside its ViewModel.
      {
        filename: TSX,
        code: `${IMPORT}
        import { useState } from 'react';
        export const SelectDatesPage = () => {
          const { state } = useSelectDatesPageLogic();
          const [x] = useState(0);
          return null;
        };`,
        errors: [{ messageId: 'foreignHook' }],
      },
      // Calls its ViewModel hook twice.
      {
        filename: TSX,
        code: `${IMPORT}
        export const SelectDatesPage = () => {
          const a = useSelectDatesPageLogic();
          const b = useSelectDatesPageLogic();
          return null;
        };`,
        errors: [{ messageId: 'calledTwice' }],
      },
      // Foreign hook not covered by the allowlist.
      {
        filename: TSX,
        code: `${IMPORT}
        import { useGlassmorphism } from '@/features/core/ui';
        export const SelectDatesPage = () => {
          const { state } = useSelectDatesPageLogic();
          const cls = useGlassmorphism();
          return null;
        };`,
        errors: [{ messageId: 'foreignHook' }],
      },
    ],
  });
};
