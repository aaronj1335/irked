var _ = require('lodash');
var config = require('./webpack.config');

module.exports = _.merge({}, config, {
  output: {
    filename: 'index.js'
  }
});
