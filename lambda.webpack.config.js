const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const nodeExternals = require('webpack-node-externals');

module.exports = (config) => {
  nrwlConfig(config);
  return {
    ...config,
    externals: [],
    target: 'node',
  };
};
