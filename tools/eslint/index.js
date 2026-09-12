// @ts-check
'use strict';

// Local ESLint plugin `holidai` — the View↔ViewModel contract rules. See wiki/docs/ARCHITECTURE.md.

const viewmodelReturnShape = require('./rules/viewmodel-return-shape');
const preferViewmodel = require('./rules/prefer-viewmodel');
const noInlineComments = require('./rules/no-inline-comments');

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  rules: {
    'viewmodel-return-shape': viewmodelReturnShape,
    'prefer-viewmodel': preferViewmodel,
    'no-inline-comments': noInlineComments,
  },
};

module.exports = plugin;
