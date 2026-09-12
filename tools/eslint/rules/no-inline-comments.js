// @ts-check
'use strict';

const DIRECTIVE =
  /^\s*(?:biome-ignore\b|eslint-disable|eslint-enable\b|@ts-check\b|@ts-expect-error\b|@ts-ignore\b|@ts-nocheck\b|\/\s*<reference\b)/;
const CODETAG = /^\s*(?:NOTE|HACK):/;
const CODETAG_SHAPED = /^\s*[A-Z][A-Z0-9_]+:/;

const TOP_LEVEL_DECLARATIONS = new Set([
  'VariableDeclaration',
  'FunctionDeclaration',
  'ClassDeclaration',
  'TSTypeAliasDeclaration',
  'TSInterfaceDeclaration',
  'TSEnumDeclaration',
  'TSDeclareFunction',
  'TSModuleDeclaration',
]);

const MEMBERS = new Set([
  'PropertyDefinition',
  'MethodDefinition',
  'TSAbstractPropertyDefinition',
  'TSAbstractMethodDefinition',
  'TSPropertySignature',
  'TSMethodSignature',
  'TSIndexSignature',
  'TSCallSignatureDeclaration',
  'TSConstructSignatureDeclaration',
  'TSEnumMember',
]);

const EXPORTS = new Set(['ExportNamedDeclaration', 'ExportDefaultDeclaration']);

/** @param {any} node */
function isTopLevelDeclaration(node) {
  if (!TOP_LEVEL_DECLARATIONS.has(node.type)) return false;
  const parent = node.parent;
  if (!parent) return false;
  if (parent.type === 'Program') return true;
  return EXPORTS.has(parent.type) && parent.parent && parent.parent.type === 'Program';
}

/** @param {any} node */
function isDocTarget(node) {
  return MEMBERS.has(node.type) || isTopLevelDeclaration(node);
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Inline comments are banned. Only `// NOTE:` / `// HACK:` codetags, tool directives, and TSDoc blocks leading a declaration are allowed.',
    },
    schema: [],
    messages: {
      noComment:
        'Inline comments are not allowed. Delete it, or record the why as `// NOTE: ...` or `// HACK: ... because ...`.',
      misplacedDoc:
        'A `/** */` block is only allowed as the leading comment of a declaration, class member or interface member.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    /** @type {Set<any>} */
    const docBlocks = new Set();

    /** @param {any} node */
    function allowLeadingDocs(node) {
      for (const comment of sourceCode.getCommentsBefore(node)) {
        if (comment.type === 'Block' && comment.value.startsWith('*')) docBlocks.add(comment);
      }
    }

    return {
      '*'(node) {
        if (!isDocTarget(node)) return;
        allowLeadingDocs(node);
        // NOTE: on `export const x` the block leads the `export` keyword, not the declaration node.
        if (node.parent && EXPORTS.has(node.parent.type)) allowLeadingDocs(node.parent);
        // NOTE: a decorator sits between the TSDoc and the declaration it documents (and before
        // `export`), so the block is a leading comment of the decorator, not of the declaration.
        const decorators = node.decorators ?? [];
        if (decorators.length > 0) allowLeadingDocs(decorators[0]);
      },
      'Program:exit'() {
        /** @type {any} */
        let codetagLine = null;

        for (const comment of sourceCode.getAllComments()) {
          if (DIRECTIVE.test(comment.value)) continue;
          if (comment.type === 'Line') {
            // NOTE: a wrapped codetag, the `//` lines directly under it at the same indentation, is
            // one comment.
            const continuesCodetag =
              codetagLine !== null &&
              comment.loc.start.line === codetagLine.loc.start.line + 1 &&
              comment.loc.start.column === codetagLine.loc.start.column &&
              !CODETAG_SHAPED.test(comment.value);
            if (CODETAG.test(comment.value) || continuesCodetag) {
              codetagLine = comment;
              continue;
            }
            context.report({ loc: comment.loc, messageId: 'noComment' });
            continue;
          }
          if (!comment.value.startsWith('*')) {
            context.report({ loc: comment.loc, messageId: 'noComment' });
            continue;
          }
          if (!docBlocks.has(comment)) {
            context.report({ loc: comment.loc, messageId: 'misplacedDoc' });
          }
        }
      },
    };
  },
};

module.exports = rule;
