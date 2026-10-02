const { createDependencyCruiserConfig } = require('@timothyrusso/arch-rules');
const { loadKitConfig } = require('@timothyrusso/config-presets');

const config = createDependencyCruiserConfig(loadKitConfig({ cwd: __dirname }), { rootDir: __dirname });

// NOTE: these domain files still import zod or a UI library type. Night 4 (#498, the Effect
// migration) moves them to Effect Schema and domain-owned types, then deletes this `warn` copy.
const DOMAIN_LIBRARY_IMPORTS =
  '^features/(trip-generation/domain/(schemas/GenerateTripSchema|entities/LocationInfo)|ai/domain/entities/services/IAiClient)\\.ts$';

module.exports = {
  ...config,
  forbidden: config.forbidden.flatMap(rule =>
    rule.name === 'domain-pure-except-effect'
      ? [
          { ...rule, from: { ...rule.from, pathNot: DOMAIN_LIBRARY_IMPORTS } },
          { ...rule, severity: 'warn', from: { ...rule.from, path: DOMAIN_LIBRARY_IMPORTS } },
        ]
      : [rule],
  ),
};
