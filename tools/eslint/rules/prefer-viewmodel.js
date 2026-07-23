// @ts-check
'use strict';

// A component (`*.tsx`) that is backed by a ViewModel must delegate all logic to it: it may call
// ONLY its own ViewModel hook, AT MOST ONCE, and no other `use*` hooks. This keeps the View a pure
// projection of the ViewModel (analog of chicio-blog's `prefer-component-store`).
//
// The ViewModel hook is identified structurally, not by name: it is whatever the file imports from a
// module path ending in `.logic` (e.g. `import { useSelectDatesPageLogic } from '@/.../SelectDatesPage.logic'`).
// A `.tsx` with no `.logic` import has no ViewModel and is exempt (pure presentational component).
//
// Sanctioned exceptions (shared primitive hooks a View may call directly) are configurable via the
// `allow` option, e.g. `["holidai/prefer-viewmodel", { "allow": ["useGlassmorphism"] }]`.

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A .tsx backed by a ViewModel (a `.logic` import) may call only its own ViewModel hook, at most once, and no other hooks.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      foreignHook:
        'A ViewModel-backed component may only call its own ViewModel hook ({{expected}}). Move this call ({{found}}) into the ViewModel.',
      calledTwice: 'The ViewModel hook {{expected}} must be called at most once.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (!filename.endsWith('.tsx') || filename.includes('.test.') || filename.includes('.spec.')) {
      return {};
    }

    const options = context.options[0] ?? {};
    const allow = new Set(options.allow ?? []);

    /** @type {Set<string>} */
    const viewModelHooks = new Set();
    // Every hook-like call, collected during traversal. Classification into ViewModel vs foreign is
    // deferred to Program:exit, once ALL imports are known — otherwise a call appearing before its
    // (hoisted) `.logic` import would be misclassified as foreign.
    /** @type {{ node: any, name: string, isMember: boolean }[]} */
    const allCalls = [];

    /** @param {string} name */
    function isHookCall(name) {
      return typeof name === 'string' && /^use[A-Z]/.test(name);
    }

    return {
      ImportDeclaration(node) {
        const source = typeof node.source.value === 'string' ? node.source.value : '';
        if (!/\.logic$/.test(source)) return;
        for (const spec of node.specifiers) {
          // named: `import { useXLogic }` / default: `import useXLogic`
          if (spec.type === 'ImportSpecifier' || spec.type === 'ImportDefaultSpecifier') {
            viewModelHooks.add(spec.local.name);
          }
        }
      },
      CallExpression(node) {
        // Identifier callee `useX()` or member callee `React.useX()` / `hooks.useX()`.
        const isMember = node.callee.type === 'MemberExpression';
        const callee = node.callee.type === 'MemberExpression' ? node.callee.property : node.callee;
        if (callee.type !== 'Identifier') return;
        const name = callee.name;
        if (!isHookCall(name)) return;
        allCalls.push({ node, name, isMember });
      },
      'Program:exit'() {
        // No ViewModel import => presentational component, nothing to enforce.
        if (viewModelHooks.size === 0) return;

        const expected = [...viewModelHooks].join(' | ');

        /** @type {{ node: any, name: string }[]} */
        const viewModelCalls = [];
        /** @type {{ node: any, name: string }[]} */
        const foreignCalls = [];
        for (const call of allCalls) {
          // A ViewModel hook is an imported binding invoked as a bare identifier. A member call
          // (`X.useY()`) is a different binding, so it can never be the ViewModel hook — only foreign.
          if (!call.isMember && viewModelHooks.has(call.name)) {
            viewModelCalls.push(call);
          } else if (!allow.has(call.name)) {
            foreignCalls.push(call);
          }
        }

        for (const call of foreignCalls) {
          context.report({
            node: call.node,
            messageId: 'foreignHook',
            data: { expected, found: call.name },
          });
        }

        // Flag a second (and further) call of any single ViewModel hook.
        const perHook = new Map();
        for (const call of viewModelCalls) {
          const count = (perHook.get(call.name) ?? 0) + 1;
          perHook.set(call.name, count);
          if (count > 1) {
            context.report({
              node: call.node,
              messageId: 'calledTwice',
              data: { expected: call.name },
            });
          }
        }
      },
    };
  },
};

module.exports = rule;
