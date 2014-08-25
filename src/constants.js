var searchlyApiKey = process.env.SEARCHLY_API_KEY;
var searchlyHost = 'dwalin-us-east-1.searchly.com';
var searchlyUrl = 'https://site:' + searchlyApiKey + '@' + searchlyHost;

module.exports = {
  FIREBASE_URL: 'https://blistering-fire-9660.firebaseio.com',
  ELASTICSEARCH_HOST: searchlyHost,
  ELASTICSEARCH_URL: searchlyApiKey? searchlyUrl : 'http://localhost:9200'
};
