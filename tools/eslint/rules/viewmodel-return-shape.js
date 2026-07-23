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

// TypeScript wrapper expressions that surround the real value: `x as const`, `x satisfies T`, `x!`.
// The @typescript-eslint parser nests the object literal under `.expression`, so we peel them off
// before checking the return shape (otherwise `return { state } as const` reads as a non-object).
const TS_WRAPPER_TYPES = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression']);

/**
 * Peel any TS wrapper expressions off a node to reach the underlying value.
 * @param {any} node
 * @returns {any}
 */
function unwrapTs(node) {
  let current = node;
  while (current && TS_WRAPPER_TYPES.has(current.type)) {
    current = current.expression;
  }
  return current;
}

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
      // Spreads and computed keys defeat static verification — a spread could inject any key, and a
      // computed key isn't statically known — so a ViewModel return must use plain literal keys only.
      const hasSpread = objExpr.properties.some((/** @type {any} */ p) => p.type === 'SpreadElement');
      const hasComputed = objExpr.properties.some(
        (/** @type {any} */ p) => p.type === 'Property' && p.computed,
      );
      if (bad.length > 0 || hasSpread || hasComputed) {
        const markers = [...bad];
        if (hasSpread) markers.push('(spread)');
        if (hasComputed) markers.push('(computed key)');
        context.report({
          node: reportNode,
          messageId: 'wrongShape',
          data: { name: hookName, shape: SHAPE, bad: markers.join(', ') },
        });
      } else if (keys.length === 0) {
        context.report({
          node: reportNode,
          messageId: 'wrongShape',
          data: { name: hookName, shape: SHAPE, bad: '(empty object)' },
        });
      }
    }

    /**
     * @param {string} hookName
     * @param {any} fn
     */
    function checkHook(hookName, fn) {
      // Implicit-return arrow: `const useXLogic = () => ({ ... })` (possibly wrapped in `as const` etc.)
      if (fn.body.type !== 'BlockStatement') {
        const body = unwrapTs(fn.body);
        if (body.type === 'ObjectExpression') {
          validateObject(body, hookName, body);
        } else {
          // Implicit-return arrow returning a non-object (e.g. a ternary) — not a valid contract.
          context.report({ node: fn, messageId: 'notObject', data: { name: hookName, shape: SHAPE } });
        }
        return;
      }
      // Block body: inspect only the hook's own returns. No returns (or only bare `return;`) => void, OK.
      for (const ret of collectOwnReturns(fn)) {
        if (!ret.argument) continue; // bare `return;` guard clause — allowed
        const arg = unwrapTs(ret.argument);
        if (arg.type !== 'ObjectExpression') {
          context.report({ node: ret, messageId: 'notObject', data: { name: hookName, shape: SHAPE } });
        } else {
          validateObject(ret, hookName, arg);
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
