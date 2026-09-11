// @ts-check
'use strict';

// RuleTester spec, run via `npm run test:eslint-rules`. NOT named `*.test.js`: the jest-expo preset
// can't run RuleTester, so these must stay outside jest's testMatch.

const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const rule = require('../rules/no-inline-comments');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

module.exports = function run() {
  ruleTester.run('no-inline-comments', rule, {
    valid: [
      // TSDoc leading a top-level declaration, an exported one, and a decorated class.
      { code: '/** Brief. */\nconst a = 1;' },
      { code: '/** Brief. */\nexport function a() {}' },
      { code: '/** Brief. */\nexport type A = string;' },
      { code: '/** Brief. */\n@injectable()\nexport class A {}' },
      // Class members and interface / type-literal members.
      { code: 'class A {\n  /** Brief. */\n  run(): void {}\n  /** Brief. */\n  value = 1;\n}' },
      { code: 'interface A {\n  /** Brief. */\n  run(): void;\n  /** Brief. */\n  value: string;\n}' },
      { code: 'type A = {\n  /** Brief. */\n  value: string;\n};' },
      {
        code: 'interface A {\n  /** Brief. */\n  (x: number): string;\n  /** Brief. */\n  new (x: number): A;\n}',
      },
      // Codetags.
      { code: '// NOTE: the array order is load-bearing.\nconst a = 1;' },
      { code: 'const a = () => {\n  // HACK: poll because the SDK never resolves on web.\n  return 1;\n};' },
      // Tool directives.
      { code: '// biome-ignore lint/style/noNonNullAssertion: checked above\nconst a = 1;' },
      { code: '// eslint-disable-next-line no-console\nconst a = 1;' },
      { code: '/* eslint-disable no-console */\nconst a = 1;' },
      { code: '// @ts-expect-error untyped module\nconst a = 1;' },
      { code: '// @ts-ignore untyped module\nconst a = 1;' },
      { code: '/// <reference types="expo/types" />\nconst a = 1;' },
      // A codetag wrapping onto the next line at the same indentation is one block.
      { code: '// NOTE: the web build forwards unknown props onto the DOM node,\n// so they must sit on the wrapper.\nconst a = 1;' },
    ],
    invalid: [
      // Plain line comment, plain block comment, JSX comment.
      { code: '// Define button states\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      { code: 'const a = 1; // set to one', errors: [{ messageId: 'noComment' }] },
      { code: '/* Define button states */\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      {
        code: 'const A = () => <View>{/* spacer */}</View>;',
        errors: [{ messageId: 'noComment' }],
      },
      // A `/**` block that does not lead a declaration.
      {
        code: 'function a() {\n  /** Define button states */\n  return 1;\n}',
        errors: [{ messageId: 'misplacedDoc' }],
      },
      { code: '/** Brief. */\nsetLoading(true);', errors: [{ messageId: 'misplacedDoc' }] },
      // Other codetags are not on the allowlist.
      { code: '// TODO: wire this up\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      { code: '// FIXME: broken on web\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      { code: '// XXX: careful\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      // Codetags are case-sensitive and need the colon.
      { code: '// note: lowercase\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      { code: '// NOTE without a colon\nconst a = 1;', errors: [{ messageId: 'noComment' }] },
      // A line below a codetag but at a different indentation is a comment of its own.
      {
        code: 'const a = () => {\n  // NOTE: wrapped.\n    // stray line\n  return 1;\n};',
        errors: [{ messageId: 'noComment' }],
      },
      // A plain comment stacked above a TSDoc block is still reported.
      {
        code: '// grouping label\n/** Brief. */\nexport const a = 1;',
        errors: [{ messageId: 'noComment' }],
      },
    ],
  });
};
