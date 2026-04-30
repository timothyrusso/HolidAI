function generateTierRules(featureTiers) {
  const featuresByTier = {};
  for (const [featurePath, tier] of Object.entries(featureTiers)) {
    if (!featuresByTier[tier]) featuresByTier[tier] = [];
    featuresByTier[tier].push(featurePath);
  }

  return Object.entries(featureTiers).flatMap(([featurePath, tier]) => {
    // Tier 0 (Core) may import from other Tier 0 peers — only higher tiers are forbidden.
    // Tier N > 0 may not import from same-tier peers or any higher tier.
    const forbiddenTiers =
      tier === 0 ? [1, 2, 3] : Array.from({ length: 4 - tier }, (_, i) => tier + i);

    const forbiddenPaths = forbiddenTiers.flatMap(t =>
      (featuresByTier[t] || []).map(f => `^${f}/`),
    );

    if (!forbiddenPaths.length) return [];

    const slug = featurePath.replace(/\//g, '-');

    return [
      {
        name: `no-tier-violation-${slug}`,
        comment:
          tier === 0
            ? `Tier 0 (Core): must not import from Tier 1, 2, or 3 features`
            : `Tier ${tier}: must not import from same-tier peers or higher-tier features`,
        severity: 'error',
        from: { path: `^${featurePath}/` },
        to: {
          path: forbiddenPaths.join('|'),
          pathNot: `^${featurePath}/`,
        },
      },
    ];
  });
}

module.exports = { generateTierRules };
