#!/usr/bin/env node

// run this w/ something like:
//   bin/generate-firebase-json.js ~/Documents/irc_logs/bbbbb\ \(745E1\)/Channels/#waterfall 2> logs.json

var parser = require('textual-log-parser');
var flatten = require('lodash.flatten');

var DIR = process.argv[2];

parser.parse(DIR, function(results) {
  var filteredResults = flatten(results)
    .filter(function(entry) {
      return entry && entry.value && entry.value[0] === '<';
    })
    .map(function(entry) {
      var from = entry.value.match(/^<([^\>]+)\>/);
      var message = entry.value.match(/^<[^\>]+\> ?(.*)/);

      if (!from || !message)
        throw new Error('failed to parse: ' + entry.value);

      return {
        date: entry.date,
        from: from && from[1],
        message: message && message[1]
      };
    })
    .reduce(function(data, entry) {
      data.logs.channels.waterfall = data.logs.channels.waterfall || {};
      data.logs.channels.waterfall[new Date(entry.date).valueOf()] = entry;

      return data;
    }, {logs: {channels: {}}});

  // output on stderr cause textual-log-parser console.log's
  console.error(JSON.stringify(filteredResults, null, 2));
});

