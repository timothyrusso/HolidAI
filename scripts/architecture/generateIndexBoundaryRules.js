function generateIndexBoundaryRules(featureTiers) {
  return Object.keys(featureTiers).map(featurePath => {
    const slug = featurePath.replace(/\//g, '-');
    return {
      name: `enforce-index-boundary-${slug}`,
      comment: `All imports into ${featurePath} from outside must go through its index.ts`,
      severity: 'error',
      from: {
        pathNot: `^${featurePath}/`,
      },
      to: {
        path: `^${featurePath}/`,
        pathNot: `^${featurePath}/index\\.ts$`,
      },
    };
  });
}

module.exports = { generateIndexBoundaryRules };
