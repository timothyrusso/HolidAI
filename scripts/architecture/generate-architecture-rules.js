const { findFeatureTiers } = require('./findFeatureTiers');
const { generateTierRules } = require('./generateTierRules');
const { generateIndexBoundaryRules } = require('./generateIndexBoundaryRules');

const featureTiers = findFeatureTiers();

module.exports = [
  ...generateTierRules(featureTiers),
  ...generateIndexBoundaryRules(featureTiers),
];
