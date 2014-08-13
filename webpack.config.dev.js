var merge = require('lodash.merge');
var config = require('./webpack.config');

module.exports = merge({}, config, {
  output: {
    filename: 'index.js'
  }
});
