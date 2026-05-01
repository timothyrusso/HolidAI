const { findFeatureTiers } = require('./findFeatureTiers');
const { generateTierRules } = require('./generateTierRules');
const { generateIndexBoundaryRules } = require('./generateIndexBoundaryRules');
const { staticLayerRules } = require('./staticLayerRules');

const featureTiers = findFeatureTiers();

module.exports = [
  ...generateTierRules(featureTiers),
  ...generateIndexBoundaryRules(featureTiers),
  ...staticLayerRules,
];
