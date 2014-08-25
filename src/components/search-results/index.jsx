var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var {Link} = require('react-router');
var merge = require('react/lib/merge');
var request = require('./../../util/request');

var constants = require('./../../constants');
var {datetime, date, splitDateForSup} = require('./../../util/format');

var SearchResults = React.createClass({
  mixins: [ReactFire],

  _renderResults: function() {
    var hits = this.state.results.map(function(result) {
      return merge({
        key: result._id,
        date: new Date(+result._id),
      }, result._source);
    }) || [];
    var results = <p>No search results found.</p>;

    if (hits.length)
      results = hits.map(function(hit) {
        var dateSplit = splitDateForSup(date(hit.date));

        return <div className='panel panel-default' key={hit.key}>
          <div className='panel-heading'>
            <h3 className='panel-title'>
              <Link to='message' date={hit.date}>
                {dateSplit[0]}
                <sup>{dateSplit[1]}</sup>
                {dateSplit[2] + ' '}
                &raquo;
              </Link>
            </h3>
          </div>

          <div className='panel-body'>
            <strong>{hit.from + ' '}</strong>
            {hit.message}
          </div>
        </div>;
      });

    return <div>
      <h3>Search results</h3>
      <div>{results}</div>
    </div>;
  },

  _renderWaiting: function() {
    return <div>
      <h3>Searching...</h3>
      <p>{this.props.query}</p>
    </div>;
  },

  componentDidMount: function() {
    var apiKeyRef = new Firebase(constants.FIREBASE_URL + '/searchly/key');

    this.bindAsObject(apiKeyRef, 'key');
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.key && this.props.query !== this.state.query)
      request({
          url: 'https://dwalin-us-east-1.searchly.com/waterfall/_search',
          method: 'POST',
          headers: {
            authorization: 'basic ' + btoa('site:' + this.state.key),
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            query: {
              query_string: {
                query: this.props.query
              }
            }
          })
        })
        .then(this.onResults, this.onSearchFail);
  },

  getInitialState: function() {
    return {};
  },

  onResults: function(xhr) {
    if (this.isMounted())
      this.setState({
        query: this.props.query,
        results: JSON.parse(xhr.response).hits.hits
      });
  },

  onSearchFail: function() {
    console.warn('tell the user when a search fails dummy');
  },

  render: function() {
    if (this.state.results)
      return this._renderResults();
    else
      return this._renderWaiting();
  }
});

module.exports = SearchResults;
