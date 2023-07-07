const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'aud_tracker.min.js',
    path: __dirname + '/dist',
    // environment: {
    //     arrowFunction: false,
    //     bigIntLiteral: false,
    //     const: false,
    //     destructuring: false,
    //     dynamicImport: false,
    //     forOf: false,
    //     module: false,
    //   }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
