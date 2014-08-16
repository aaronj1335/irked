#!/usr/bin/env node

// bin/generate-firebase-json.js ~/Documents/irc_logs/bbbbb\ \(745E1\)/Channels/#waterfall   2>&1 1>/dev/null | bin/add-documents-to-elasticsearch-index.js

var JSONStream = require('JSONStream');
var eventStream = require('event-stream');
var request = require('request');

var constants = require('./../src/constants');

process.stdin
  .pipe(JSONStream.parse('logs.channels.waterfall.*'))
  .pipe(eventStream.map(function(data, callback) {
    var stamp = new Date(data.date).valueOf();
    var url = constants.ELASTICSEARCH_URL + '/waterfall/message/' + stamp;

    delete data.date;

    request({
      url: url,
      method: 'PUT',
      body: JSON.stringify(data)
    }, function(error) {
      callback(error, 'wrote message: ' + data.message + '\n');
    });
  }))
  .pipe(process.stdout);
