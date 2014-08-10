#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var child = require('child_process');

var connect = require('connect');
var logger = require('connect-logger');

var html = fs.readFileSync('index.html')
  .toString()
  .replace(/(\/index.js)/, 'http://localhost:8080$1');

child.spawn('webpack-dev-server', ['--config', 'webpack.config.dev.js'], {
  stdio: [0, 1, 2]
});

var app = connect();

app
  .use(logger())
  .use(function(req, res) {
    res.end(html);
  });

http.createServer(app).listen(8000);
console.log('listening');
