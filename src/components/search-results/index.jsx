var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var {Link} = require('react-router');

var constants = require('./../../constants');
var {datetime, date, splitDateForSup} = require('./../../util/format');

var SearchResults = React.createClass({
  mixins: [ReactFire],

  _renderResults: function() {
    var hits = this.state.search.result.hits || [];
    var results = <p>No search results found.</p>;

    if (hits.length)
      results = hits.map(function(hit) {
        var dateSplit = splitDateForSup(date(hit.date));

        return <div className='panel panel-default'>
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
