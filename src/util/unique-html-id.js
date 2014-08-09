var _ = require('lodash');

module.exports = function() {
  return 'uniqueid' + _.uniqueId();
};
