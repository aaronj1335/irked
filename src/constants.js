var searchlyApiKey = process.env.SEARCHLY_API_KEY;
var searchlyUrl = 'https://site:' + searchlyApiKey +
  '@dwalin-us-east-1.searchly.com';

module.exports = {
  FIREBASE_URL: 'https://blistering-fire-9660.firebaseio.com',
  ELASTICSEARCH_URL: searchlyApiKey? searchlyUrl : 'http://localhost:9200'
};
