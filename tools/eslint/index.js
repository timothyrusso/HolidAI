// @ts-check
'use strict';

// Local ESLint plugin `holidai` — mechanizes the View↔ViewModel contract.
// See wiki/docs/ARCHITECTURE.md and the individual rule files for rationale.

const viewmodelReturnShape = require('./rules/viewmodel-return-shape');
const preferViewmodel = require('./rules/prefer-viewmodel');

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    'viewmodel-return-shape': viewmodelReturnShape,
    'prefer-viewmodel': preferViewmodel,
  },
};

module.exports = plugin;
