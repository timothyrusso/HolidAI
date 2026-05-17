const staticLayerRules = [
  {
    name: 'tsx-no-direct-layer-import',
    comment:
      '.tsx files may only import the ViewModel (.logic.ts), UI components, and styles — never facades, data, useCases, di, state, hooks, libraries, or mappers directly. domain/ is allowed for import type only (see tsx-no-runtime-domain-import)',
    severity: 'error',
    from: { path: '\\.tsx$' },
    to: {
      path: '/(facades|data|useCases|di|state|hooks|libraries|mappers)/',
    },
  },
  {
    name: 'tsx-no-runtime-domain-import',
    comment:
      '.tsx files may use import type from domain/ for prop annotations, but must never import runtime values from domain/ — all runtime logic flows through the ViewModel (.logic.ts)',
    severity: 'error',
    from: { path: '\\.tsx$' },
    to: {
      path: '/domain/',
      dependencyTypesNot: ['type-only'],
    },
  },
  {
    name: 'tsx-no-cross-feature-public-api',
    comment:
      '.tsx files must not import runtime values from a cross-feature public API (index.ts) — all cross-feature runtime values must flow through the ViewModel (.logic.ts). import type from any feature index.ts is allowed for prop annotations. Exceptions: features/core/navigation is allowed for Routes/Stacks constants used directly in BasicView; features/core/ui is allowed because UI components are the natural direct consumer of the component library; app/ route and layout files are thin entry points that are expected to import feature public APIs directly.',
    severity: 'error',
    from: { path: '\\.tsx$', pathNot: '^app/' },
    to: {
      path: '^features/.*/index\\.ts$',
      pathNot: '^features/core/(navigation|ui)/',
      dependencyTypesNot: ['type-only'],
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
