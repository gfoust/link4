const path = require('path');
const merge = require('webpack-merge');

const base = require('./config.base');

module.exports = [
  merge(base[0], {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    devServer: {
      compress: true,
      contentBase: [path.join(__dirname, '../static'), path.join(__dirname, '../dist')],
      historyApiFallback: true,
      hot: true,
      overlay: true,
      watchOptions: {
        ignored: [ 'node_modules', '**/*.spec.ts' ],
      },
      disableHostCheck: true,
      host: '0.0.0.0',
    }
  }),
  // merge(base[1], {
  //   mode: 'development',
  //   devtool: 'inline-cheap-module-source-map',
  //   output: {
  //     path: path.resolve(__dirname, '../dist')
  //   },
  // })
]