const path = require('path');
const merge = require('webpack-merge');

const base = require('./config.base');

module.exports = base.map(config =>
  merge(config, {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, '../dist')
    },
  })
);
