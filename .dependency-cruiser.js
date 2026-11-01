const { createDependencyCruiserConfig } = require('@timothyrusso/arch-rules');
const { loadKitConfig } = require('@timothyrusso/config-presets');

module.exports = createDependencyCruiserConfig(loadKitConfig({ cwd: __dirname }), { rootDir: __dirname });
