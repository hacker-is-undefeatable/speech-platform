const { override, addWebpackModuleRule, adjustWebpackConfig } = require('customize-cra');

module.exports = override(
  // Add Babel loader for ES modules
  addWebpackModuleRule({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  }),
  // Ignore source map warnings for fflate
  adjustWebpackConfig((config) => {
    config.ignoreWarnings = [
      {
        module: /node_modules\/fflate/,
        message: /Failed to parse source map/,
      },
    ];
    return config;
  })
);

