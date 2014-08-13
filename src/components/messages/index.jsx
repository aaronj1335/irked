var last = require('lodash.last');
var React = require('react');
var ReactFire = require('reactfire');
var {Link} = require('react-router');

var constants = require('./../../constants');
var Message = require('./../message/index.jsx');
var User = require('./../mixins/user.js');

var Messages = React.createClass({
  mixins: [ReactFire, User],

  numMsgs: 80,

  _messageKey: function() {
    return this.state.user && this.state.user.date &&
      new Date(this.state.user.date).valueOf().toString();
  },

  _makeMessagesRefs: function() {
    var messagesUrl = constants.FIREBASE_URL + '/logs/channels/waterfall';
    var messagesRef = new Firebase(messagesUrl);

    if (this._messageKey())
      return [
        messagesRef.endAt(null, this._messageKey()).limit(this.numMsgs / 2),
        messagesRef.startAt(null, this._messageKey()).limit(this.numMsgs / 2)
        ];
    else
      return [messagesRef.limit(this.numMsgs)];
  },

  _bindMessageRefs: function() {
    var refs = this._makeMessagesRefs();

    this.bindAsArray(refs[0], 'messagesBefore');

    if (refs[1])
      this.bindAsArray(refs[1], 'messagesAfter');
    else
      this.setState({messagesAfter: []});
  },

  componentDidMount: function() {
    this._bindMessageRefs();
    this.scrollKeyElementIntoView();
  },

  componentDidUpdate: function(prevProps, prevState) {
    var prevDate = prevState.user && prevState.user.date;
    var currentDate = this.state.user && this.state.user.date;

    if (prevDate !== currentDate) {
      this.unbind('messagesBefore');

      if (this.firebaseRefs.messagesAfter)
        this.unbind('messagesAfter');

      this._bindMessageRefs();
    }

    this.scrollKeyElementIntoView();
  },

  getInitialState: function() {
    return {
      messagesBefore: [],
      messagesAfter: []
    };
  },

  scrollKeyElementIntoView: function() {
    if (this.refs.keyMessage) {
      this.refs.keyMessage.getDOMNode().scrollIntoView();

      if (this.props.controlPageScrolling && this._messageKey())
        window.scrollTo(0, window.scrollY -
                        (document.documentElement.clientHeight / 2));
    }
  },

  render: function() {
    var keyMessage = last(this.state.messagesBefore);
    var highlighted = this._messageKey()? keyMessage : null;
    var messages = this.state.messagesBefore
      .concat(this.state.messagesAfter.slice(1));

    if (this.state.messagesBefore.length)
      var before = <tr>
        <td className='text-center' colSpan='3'>
          <Link to='message' date={this.state.messagesBefore[0].date}>
            Load prior messages
          </Link>
        </td>
      </tr>;

      if (this.state.messagesAfter.length > 1)
      var after = <tr>
        <td className='text-center' colSpan='3'>
          <Link to='message' date={last(this.state.messagesAfter).date}>
            Load subsequent messages
          </Link>
        </td>
      </tr>;


    return <table className='messages table'>
      <tbody>
        {before}
        {messages.map(function(message) {
          return <Message
            className={message === highlighted? 'bg-info' : ''}
            ref={message === keyMessage? 'keyMessage' : null}
            key={message.date}
            date={message.date}
            from={message.from}
            message={message.message} />;
        })}
        {after}
      </tbody>
    </table>;
  }
});

module.exports = Messages;
