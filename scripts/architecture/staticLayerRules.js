const staticLayerRules = [
  {
    name: 'tsx-no-direct-layer-import',
    comment:
      '.tsx files may only import the ViewModel (.logic.ts), UI components, and styles — never facades, domain, data, useCases, di, state, hooks, libraries, or mappers directly',
    severity: 'error',
    from: { path: '\\.tsx$' },
    to: {
      path: '/(facades|domain|data|useCases|di|state|hooks|libraries|mappers)/',
    },
  },
  {
    name: 'tsx-no-cross-feature-public-api',
    comment:
      '.tsx files must not import from a cross-feature public API (index.ts) — all cross-feature types and values must flow through the ViewModel (.logic.ts). Exception: features/core/navigation is allowed for Routes/Stacks constants used directly in BasicView.',
    severity: 'error',
    from: { path: '\\.tsx$' },
    to: {
      path: '^features/.*/index\\.ts$',
      pathNot: '^features/core/navigation/',
    },
  },
  {
    name: 'domain-no-outer-layer-import',
    comment:
      'domain/ is the innermost layer — must not import from data/, useCases/, facades/, ui/, state/, hooks/, libraries/, di/, or mappers/',
    severity: 'error',
    from: { path: '/domain/' },
    to: {
      path: '/(data|useCases|facades|ui|state|hooks|libraries|di|mappers)/',
    },
  },
  {
    name: 'usecases-no-data-import',
    comment:
      'useCases/ must depend only on domain/ interfaces — never on data/ concrete implementations',
    severity: 'error',
    from: { path: '/useCases/' },
    to: {
      path: '/data/',
    },
  },
  {
    name: 'domain-no-cross-feature-runtime-import',
    comment:
      'domain/ files must not import runtime values from another feature\'s public API (index.ts). ' +
      'Use import type for cross-feature type references. ' +
      'Exception: features/core/error is allowed so domain error subclasses can extend BaseError.',
    severity: 'error',
    from: { path: '/domain/' },
    to: {
      path: '^features/.*/index\\.ts$',
      pathNot: '^features/core/error/',
      dependencyTypes: ['import'],
    },
  },
  {
    name: 'no-circular',
    comment: 'Circular dependencies make code hard to reason about and test — resolve via dependency inversion or module restructuring',
    severity: 'error',
    from: {},
    to: { circular: true },
  },
];

module.exports = { staticLayerRules };
