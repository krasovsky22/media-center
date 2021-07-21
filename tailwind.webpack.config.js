const nrwlConfig = require('@nrwl/react/plugins/webpack.js');

module.exports = (config) => {
  nrwlConfig(config);
  return {
    ...config,
    node: {
      global: true,
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      dns: 'empty',
      tls: 'empty',
      http2: 'empty',
    },
    plugins: [...config.plugins],
    module: {
      rules: [
        ...config.module.rules,
        {
          test: /\.scss$/,
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('postcss-import'),
                require('tailwindcss')('./tailwind.config.js'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
    },
  };
};
