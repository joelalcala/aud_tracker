const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/aud_tracker.js',
  output: {
    filename: 'aud_tracker.min.js',
    path: __dirname + '/dist'
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
