var promise = require('es6-promise');

module.exports = function(opts) {
  return new promise.Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    opts = opts || {};
    opts.method = opts.method || 'GET';

    if (opts.withCredentials)
      xhr.withCredentials = true;

    xhr.open(opts.method, opts.url, true);

    Object.keys(opts.headers || {}).forEach(function(key) {
      xhr.setRequestHeader(key, opts.headers[key]);
    });

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300)
        resolve(xhr);
      else
        reject(xhr);
    };

    xhr.onerror = function() {
      reject(new Error('error requesting ' + opts.url));
    };

    xhr.send(opts.data);
  });
};
