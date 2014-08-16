var moment = require('moment');

module.exports = {
  date: function(date) {
    return moment(date).format('MMMM Do YYYY');
  },

  datetime: function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss A');
  },

  time: function(date) {
    return moment(date).format('h:mm:ss');
  }
};
