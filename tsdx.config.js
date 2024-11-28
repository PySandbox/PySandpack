const tsconfigPaths = require('tsconfig-paths');
const { resolve } = require('path');
const { compilerOptions } = require('./tsconfig.json');

// Resolve paths
const mappings = tsconfigPaths.loadConfig().paths;
const resolvedPaths = Object.entries(mappings).map(([alias, paths]) => ({
  find: alias.replace('/*', ''),
  replacement: resolve(__dirname, compilerOptions.baseUrl, paths[0].replace('/*', '')),
}));

module.exports = {
  rollup(config) {
    config.plugins.push(
      require('@rollup/plugin-alias')({
        entries: resolvedPaths,
      })
    );
    return config;
  },
};
