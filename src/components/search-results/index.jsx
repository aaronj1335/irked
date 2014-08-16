var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var {Link} = require('react-router');

var constants = require('./../../constants');
var {datetime, date} = require('./../../util/format');

var SearchResults = React.createClass({
  mixins: [ReactFire],

  _renderResults: function() {
    var hits = this.state.search.result.hits || [];
    var results = [];

    if (hits.length)
      // probably a better way to do this, but adjacent jsx nodes need to be
      // underneath a single parent, and that doesn't work with <dl>'s, so just
      // make an array with 'push'
      hits.forEach(function(result) {
        results.push(<dt key={result.date + '_dt'}>
          <Link to='message' date={result.date}>
            {date(result.date)}
          </Link>
        </dt>);
        results.push(<dd key={result.date + '_dd'}>
          <strong>{result.from + ' '}</strong>
          {result.message}
        </dd>);
      });
    else
      results = <p>No search results found.</p>;

    return <div>
      <h3>Search results</h3>
      <p>{this.props.query}</p>
      <dl className='dl-horizontal'>{results}</dl>
    </div>;
  },

  _renderWaiting: function() {
    return <div>
      <h3>Searching...</h3>
      <p>{this.props.query}</p>
    </div>;
  },

  _setSearchesRef: function() {
    var searchesRef = new Firebase(constants.FIREBASE_URL + '/searches');

    if (this._ref)
      this.cleanup();

    this._ref = searchesRef.push({query: this.props.query});

    this.bindAsObject(this._ref, 'search');
    window.addEventListener('unload', this.cleanup);
  },

  componentDidMount: function() {
    this._setSearchesRef();
  },

  componentWillUnmount: function() {
    this.cleanup();
    window.removeEventListener('unload', this.cleanup);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.query != this.props.query)
      this._setSearchesRef();
  },

  getInitialState: function() {
    return {};
  },

  cleanup: function() {
    this._ref.remove();
    // apparently this is not needed because reactfire already unbound this?
    // really need a way to try/catch things if something is already unbound...
    // this.unbind('search');
  },

  render: function() {
    var search = this.state.search;

    if (search && search.result)
      return this._renderResults();
    else
      return this._renderWaiting();
  }
});

module.exports = SearchResults;
