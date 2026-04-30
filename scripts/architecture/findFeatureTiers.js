const fs = require('fs');
const path = require('path');

const FEATURES_DIR = path.resolve(__dirname, '../../features');
const TIER_REGEX = /export const FEATURE_TIER: FeatureTier = (\d+)/;

function findFeatureTiers(dir = FEATURES_DIR, depth = 0, results = {}) {
  if (depth > 1) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(dir, entry.name);
    const indexPath = path.join(fullPath, 'index.ts');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const match = content.match(TIER_REGEX);
      if (match) {
        const relativePath = path
          .relative(path.resolve(__dirname, '../../'), fullPath)
          .replace(/\\/g, '/');
        results[relativePath] = parseInt(match[1], 10);
      }
    }

    findFeatureTiers(fullPath, depth + 1, results);
  }

  return results;
}

module.exports = { findFeatureTiers };
