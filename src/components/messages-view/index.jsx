var React = require('react');

var User = require('./../mixins/user');
var Messages = require('./../messages/index.jsx');

var MessagesView = React.createClass({
  mixins: [User],

  componentDidMount: function() {
    if (this._userRef)
      this._userRef.child('date').set(this.props.params.date);
  },

  render: function() {
    return <Messages />;
  }
});

module.exports = MessagesView;
