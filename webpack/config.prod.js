const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('./config.base'), {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist')
  },
});
