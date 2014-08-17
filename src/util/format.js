var moment = require('moment');

module.exports = {
  date: function(date) {
    return moment(date).format('MMMM Do YYYY');
  },

  datetime: function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss A');
  },

  // this function splits the return value of format.date or format.datetime
  // such that you can add <sup> tags around the "st" or "th". i went with this
  // over inserting the tags since it helps us avoid setting innerhtml
  splitDateForSup: function(str) {
    return str.match(/(\w+\s\d+)(\w{2})(.*)/).slice(1);
  },

  time: function(date) {
    return moment(date).format('h:mm:ss');
  }
};
