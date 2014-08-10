var React = require('react');

var User = require('./../mixins/user');
var Messages = require('./../messages/index.jsx');

var MessagesView = React.createClass({
  mixins: [User],

  foo: true,

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    this._userRef.update({date: this.props.params.date || null});
  },

  render: function() {
    return <Messages />;
  }
});

module.exports = MessagesView;
