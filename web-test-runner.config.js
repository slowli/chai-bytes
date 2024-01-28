const { fromRollup } = require('@web/dev-server-rollup');
const rollupCommonjs = require('@rollup/plugin-commonjs');

const commonjs = fromRollup(rollupCommonjs);

module.exports = {
  nodeResolve: true,
  files: ['test/*.mjs'],
  plugins: [
    commonjs({
      include: [
        // CommonJS plugin is slow, list the required packages explicitly:
        'index.js'
      ]
    })
  ]
};
