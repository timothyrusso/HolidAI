'use strict';

// Runner for the local ESLint-rule specs. RuleTester normally expects a test framework's
// describe/it; we shim them so each case runs inline and throws on the first failure — which
// makes this a plain, dependency-free `node` script (the repo's jest-expo preset is a React
// Native environment unsuited to running RuleTester).

const { RuleTester } = require('eslint');

RuleTester.describe = (_text, method) => method.call(RuleTester);
RuleTester.it = (_text, method) => method.call(RuleTester);
RuleTester.itOnly = (_text, method) => method.call(RuleTester);

const specs = [
  ['viewmodel-return-shape', require('./viewmodel-return-shape.cases')],
  ['prefer-viewmodel', require('./prefer-viewmodel.cases')],
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
