var React = require('react');
var ReactFire = require('reactfire');

var constants = require('./../../constants');
var Message = require('./../message/index.jsx');
var User = require('./../mixins/user.js');

var Messages = React.createClass({
  mixins: [ReactFire, User],

  componentDidMount: function() {
    var messagesUrl = constants.FIREBASE_URL + '/logs/channels/waterfall';
    var messagesRef = new Firebase(messagesUrl).limit(500);

    this.bindAsArray(messagesRef, 'messages');

    this.scrollLastElementIntoView();
  },

  componentDidUpdate: function() {
    this.scrollLastElementIntoView();
  },

  getInitialState: function() {
    return {messages: []};
  },

  scrollLastElementIntoView: function() {
    var lastMessage = this.getDOMNode().lastChild.lastChild;

    if (lastMessage)
      lastMessage.scrollIntoView();
  },

  render: function() {
    return <table className='messages table'>
      <tbody>
        {this.state.messages.map(function(message) {
          return <Message
            key={message.date}
            date={message.date}
            from={message.from}
            message={message.message} />;
        })}
      </tbody>
    </table>;
  }
});

module.exports = Messages;
