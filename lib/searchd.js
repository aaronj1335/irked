var Firebase = require('Firebase');
var request = require('request');

var constants = require('./../src/constants');

var ref = new Firebase(constants.FIREBASE_URL + '/searches');
var inFlight = {};

function makeSearchResult(response) {
  var parsed = JSON.parse(response.body);

  return {
    hits: (parsed.hits && (parsed.hits.hits || []).map(function(hit) {
      return {
        date: new Date(+hit._id).toISOString(),
        from: hit._source.from,
        message: hit._source.message
      };
    })) || null,
    total: (parsed.hits && parsed.hits.total) || 0
  };
}

function searchShouldBeHandled(search) {
  return !(search.date in inFlight) && !search.result;
}

ref.auth(process.env.FIREBASE_SECRET, function() {
  ref.on('value', function(snapshot) {
    var val = snapshot.val();

    if (val) {
      Object.keys(val).forEach(function(id) {
        var search = val[id];

        if (searchShouldBeHandled(search)) {
          inFlight[search.date] = request({
            url: constants.ELASTICSEARCH_URL + '/waterfall/_search',
            body: JSON.stringify({query: {query_string: {query: search.query}}})
          }, function(error, response) {
            if (error)
              throw error;

            console.log('got search response:');
            console.dir(JSON.parse(response.body));

            ref.child(id + '/result').update(makeSearchResult(response));

            delete inFlight[search.date];
          });
          console.log('new search:',JSON.stringify(search, null, 2));
        }
      });
    }
  });
}, function() {
  console.error('ERROR: couldn\'t log in, make sure to set FIREBASE_SECRET env var');
});
