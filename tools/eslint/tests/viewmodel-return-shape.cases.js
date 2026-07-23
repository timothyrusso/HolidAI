// @ts-check
'use strict';

// Standalone RuleTester spec for `viewmodel-return-shape`. Run via `npm run test:eslint-rules`
// (the runner shims RuleTester's describe/it so cases execute inline and throw on failure).
// The filename deliberately avoids the `.test.`/`.spec.` tokens: the repo's jest-expo preset
// provides a React Native environment unsuited to running ESLint's RuleTester, so these must
// NOT be picked up by `jest`.

const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const rule = require('../rules/viewmodel-return-shape');

const ruleTester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' },
});

const LOGIC = 'SelectDatesPage.logic.ts';

module.exports = function run() {
  ruleTester.run('viewmodel-return-shape', rule, {
    valid: [
      // Full three-bucket contract.
      {
        filename: LOGIC,
        code: `export const useSelectDatesPageLogic = () => {
          return { state: { a: 1 }, derived: { b: 2 }, effects: { c: () => {} } };
        };`,
      },
      // Non-empty subset (state + effects, no derived).
      {
        filename: LOGIC,
        code: `export const useXLogic = () => { return { state: { a: 1 }, effects: { c: () => {} } }; };`,
      },
      // Implicit-return arrow object.
      {
        filename: LOGIC,
        code: `export const useXLogic = () => ({ effects: { c: () => {} } });`,
      },
      // Void / effect-only ViewModel (no return).
      {
        filename: LOGIC,
        code: `export const useSignInPageLogic = () => { const x = 1; };`,
      },
      // Bare guard return + a valid object return.
      {
        filename: LOGIC,
        code: `export const useXLogic = () => { if (Math.random()) return; return { state: { a: 1 } }; };`,
      },
      // Nested function return (useEffect cleanup) must be ignored.
      {
        filename: LOGIC,
        code: `export const useXLogic = () => {
          const cleanup = () => { return { notAllowed: 1 }; };
          return { effects: { cleanup } };
        };`,
      },
      // Not a .logic.ts file => rule does not apply.
      {
        filename: 'helper.ts',
        code: `export const useXLogic = () => { return { anything: 1 }; };`,
      },
    ],
    invalid: [
      // Flat grab-bag (the current codebase shape).
      {
        filename: LOGIC,
        code: `export const useSelectDatesPageLogic = () => {
          return { startDate: 1, handleButtonPress: () => {}, numberOfDays: 2 };
        };`,
        errors: [{ messageId: 'wrongShape' }],
      },
      // A single disallowed key mixed with allowed ones.
      {
        filename: LOGIC,
        code: `export const useXLogic = () => { return { state: {}, loading: true }; };`,
        errors: [{ messageId: 'wrongShape' }],
      },
      // Non-conforming return NESTED in control flow (the key hardening case).
      {
        filename: LOGIC,
        code: `export const useXLogic = () => {
          if (Math.random()) {
            return { foo: 1 };
          }
          return { state: {} };
        };`,
        errors: [{ messageId: 'wrongShape' }],
      },
      // Returns a non-object.
      {
        filename: LOGIC,
        code: `export const useXLogic = () => { return 42; };`,
        errors: [{ messageId: 'notObject' }],
      },
      // Name-agnostic: hook without the `Logic` suffix is still checked.
      {
        filename: 'TripDetailsCard.logic.ts',
        code: `export const useTripDetailsCard = () => { return { dateLabel: 'x' }; };`,
        errors: [{ messageId: 'wrongShape' }],
      },
    ],
  });
};
