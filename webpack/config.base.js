const path = require('path');

module.exports = {
  entry: './main.tsx',
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      'src': path.resolve('./src'),
    },
  },
  context: path.resolve('./src'),
  output: {
    filename: 'link4.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader',
      },
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          config: {
            path: __dirname,
          }
        },
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader',
      },
    ],
  },
};
