const staticLayerRules = [
  {
    name: 'tsx-no-direct-layer-import',
    comment:
      '.tsx files may only import the ViewModel (.logic.ts), UI components, and styles — never facades, domain, data, useCases, di, state, hooks, libraries, or mappers directly',
    severity: 'error',
    from: { path: '\\.tsx$' },
    to: {
      path: '/(facades|domain|data|useCases|di|state|hooks|libraries|mappers)/',
      pathNot: '/index\\.ts$',
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
      pathNot: '/index\\.ts$',
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
      pathNot: '/index\\.ts$',
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
