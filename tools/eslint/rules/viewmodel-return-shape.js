// @ts-check
'use strict';

// A ViewModel (`*.logic.ts`) hook must return one of:
//   - an object literal whose top-level keys are a non-empty subset of { state, derived, effects }
//     (`state` = raw/local/external state the view renders; `derived` = values computed from state;
//      `effects` = handlers/commands the view invokes), or
//   - nothing (void) — effect-only ViewModels are valid.
// The rule is filename-triggered (any `*.logic.ts`) and hook-name-agnostic, so a mis-named hook
// cannot dodge it. Only the hook's OWN returns are inspected — returns inside nested functions
// (e.g. a `useEffect` cleanup) are ignored.

const ALLOWED = new Set(['state', 'derived', 'effects']);
const SHAPE = '{ state, derived?, effects }';

const NESTED_FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]);

/**
 * A hook is any function whose name starts with `use` + uppercase (React convention).
 * @param {unknown} name
 */
function isHookName(name) {
  return typeof name === 'string' && /^use[A-Z]/.test(name);
}

/**
 * Collect the ReturnStatement nodes that belong to `fnNode` itself, skipping any nested
 * function bodies (their returns belong to those functions, not the hook).
 * @param {import('estree').Function} fnNode
 * @returns {import('estree').ReturnStatement[]}
 */
function collectOwnReturns(fnNode) {
  /** @type {any[]} */
  const returns = [];

  /** @param {any} node */
  function walk(node) {
    if (!node || typeof node.type !== 'string') return;
    if (node.type === 'ReturnStatement') {
      returns.push(node);
      // A return's argument can't contain another return for THIS function, but it may
      // contain nested functions — those are pruned by the child check below.
    }
    for (const key of Object.keys(node)) {
      if (key === 'parent') continue;
      const value = node[key];
      const children = Array.isArray(value) ? value : [value];
      for (const child of children) {
        if (!child || typeof child.type !== 'string') continue;
        if (NESTED_FUNCTION_TYPES.has(child.type)) continue; // don't descend into nested functions
        walk(child);
      }
    }
  }

  // Start from the body, so the hook function node itself isn't misread as "nested".
  walk(fnNode.body);
  return returns;
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A ViewModel (*.logic.ts) hook must return an object literal whose keys are a non-empty subset of { state, derived, effects }, or return nothing.',
    },
    schema: [],
    messages: {
      notObject:
        "ViewModel hook '{{name}}' must return an object literal shaped as {{shape}} (or nothing). Found a non-object return.",
      wrongShape:
        "ViewModel hook '{{name}}' must return only a non-empty subset of {{shape}}. Disallowed keys: {{bad}}.",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (!filename.endsWith('.logic.ts') || filename.includes('.test.') || filename.includes('.spec.')) {
      return {};
    }

    /** @param {any} objExpr */
    function keysOf(objExpr) {
      return objExpr.properties
        .filter((/** @type {any} */ p) => p.type === 'Property' && !p.computed)
        .map((/** @type {any} */ p) => {
          if (p.key.type === 'Identifier') return p.key.name;
          if (p.key.type === 'Literal') return String(p.key.value);
          return null;
        })
        .filter(Boolean);
    }

    /**
     * @param {any} reportNode
     * @param {string} hookName
     * @param {any} objExpr
     */
    function validateObject(reportNode, hookName, objExpr) {
      const keys = keysOf(objExpr);
      const bad = keys.filter((/** @type {any} */ k) => !ALLOWED.has(k));
      if (keys.length === 0 || bad.length > 0) {
        context.report({
          node: reportNode,
          messageId: 'wrongShape',
          data: { name: hookName, shape: SHAPE, bad: bad.join(', ') || '(empty object)' },
        });
      }
    }

    /**
     * @param {string} hookName
     * @param {any} fn
     */
    function checkHook(hookName, fn) {
      // Implicit-return arrow: `const useXLogic = () => ({ ... })`
      if (fn.body.type === 'ObjectExpression') {
        validateObject(fn.body, hookName, fn.body);
        return;
      }
      // Implicit-return arrow returning a non-object (e.g. a ternary) — not a valid contract.
      if (fn.body.type !== 'BlockStatement') {
        context.report({ node: fn, messageId: 'notObject', data: { name: hookName, shape: SHAPE } });
        return;
      }
      // Block body: inspect only the hook's own returns. No returns (or only bare `return;`) => void, OK.
      for (const ret of collectOwnReturns(fn)) {
        if (!ret.argument) continue; // bare `return;` guard clause — allowed
        if (ret.argument.type !== 'ObjectExpression') {
          context.report({ node: ret, messageId: 'notObject', data: { name: hookName, shape: SHAPE } });
        } else {
          validateObject(ret, hookName, ret.argument);
        }
      }
    }

    /**
     * @param {string} name
     * @param {any} fnNode
     */
    function maybeCheck(name, fnNode) {
      if (isHookName(name) && (fnNode.type === 'ArrowFunctionExpression' || fnNode.type === 'FunctionExpression' || fnNode.type === 'FunctionDeclaration')) {
        checkHook(name, fnNode);
      }
    }

    return {
      // `export const useXLogic = () => {}` / `const useXLogic = function () {}`
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' && node.init) {
          maybeCheck(node.id.name, node.init);
        }
      },
      // `export function useXLogic() {}`
      FunctionDeclaration(node) {
        if (node.id) {
          maybeCheck(node.id.name, node);
        }
      },
    };
  },
};

module.exports = rule;
