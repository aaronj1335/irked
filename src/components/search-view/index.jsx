var React = require('react');

var SearchResults = require('./../search-results/index.jsx');

var SearchView = React.createClass({
  render: function() {
    return <SearchResults query={this.props.query.q} />;
  }
});

module.exports = SearchView;
