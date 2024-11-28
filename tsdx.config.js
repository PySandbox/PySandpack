// tsdx.config.js
const path = require('path');
const alias = require('@rollup/plugin-alias');

module.exports = {
  rollup(config, options) {
    const aliases = {
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@metadata': path.resolve(__dirname, 'src/metadata')
    };

    config.plugins.push(
      alias({
        entries: Object.entries(aliases).map(([find, replacement]) => ({
          find,
          replacement
        }))
      })
    );

    return config;
  }
};
