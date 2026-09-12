'use strict';

// Runner for the ESLint-rule specs. RuleTester's describe/it are shimmed to run inline: the repo's
// jest-expo preset can't host RuleTester, so these run as a plain `node` script.

const { RuleTester } = require('eslint');

RuleTester.describe = (_text, method) => method.call(RuleTester);
RuleTester.it = (_text, method) => method.call(RuleTester);
RuleTester.itOnly = (_text, method) => method.call(RuleTester);

const specs = [
  ['viewmodel-return-shape', require('./viewmodel-return-shape.cases')],
  ['prefer-viewmodel', require('./prefer-viewmodel.cases')],
  ['no-inline-comments', require('./no-inline-comments.cases')],
];

let failed = false;
for (const [name, run] of specs) {
  try {
    run();
    process.stdout.write(`  ok  ${name}\n`);
  } catch (error) {
    failed = true;
    process.stdout.write(`FAIL  ${name}\n`);
    process.stdout.write(`${error && error.stack ? error.stack : error}\n`);
  }
}

if (failed) {
  process.stdout.write('\nESLint rule tests FAILED\n');
  process.exit(1);
}
process.stdout.write('\nAll ESLint rule tests passed\n');
