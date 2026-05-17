const generateAllRules = require('./scripts/architecture/generate-architecture-rules.js');

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [...generateAllRules],
  options: {
    doNotFollow: {
      path: ['node_modules'],
    },

    tsPreCompilationDeps: true,

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['react-native', 'import', 'require', 'node', 'default', 'types'],
      mainFields: ['main', 'types', 'typings'],
    },

    skipAnalysisNotInRules: true,

    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern: '^(?:features|di|convex|app|types)/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
