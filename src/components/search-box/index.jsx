var React = require('react');
var Router = require('react-router');

var SearchBox = React.createClass({
  onSubmit: function(event) {
    event.preventDefault();

    Router.transitionTo('search', null, {q: this.refs.q.getDOMNode().value});
  },

  render: function() {
    return <form onSubmit={this.onSubmit} className={this.props.className} role='form'>
      <div className='form-group'>
        <input type='search'
          ref='q'
          autoFocus
          className='form-control'
          placeholder='Search...'></input>
      </div>
    </form>;
  }
});

module.exports = SearchBox;
