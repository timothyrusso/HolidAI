const { createDependencyCruiserConfig, DEFAULT_DOMAIN_PUBLIC_API_EXCEPTIONS } = require('@timothyrusso/arch-rules');
const { loadKitConfig } = require('@timothyrusso/config-presets');

// NOTE: `domain-no-cross-feature-runtime-import` also flags `import type` (a known gap in the kit's
// ARCHITECTURE.md). The trips domain derives its entities from the trip `ai` decodes
// (`GeneratedTrip`), a type-only import, so `ai` joins the exceptions until the rule tells them apart.
module.exports = createDependencyCruiserConfig(loadKitConfig({ cwd: __dirname }), {
  rootDir: __dirname,
  domainPublicApiExceptions: [...DEFAULT_DOMAIN_PUBLIC_API_EXCEPTIONS, 'ai'],
});
