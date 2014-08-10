var React = require('react');
var Router = require('react-router');
var {Routes, Route} = Router;

var Login = require('./components/login/index.jsx');
var User = require('./components/mixins/user');
var Nav = require('./components/nav/index.jsx');
var Messages = require('./components/messages/index.jsx');
var MessagesView = require('./components/messages-view/index.jsx');
var auth = require('./auth')();
require('./new-user-maker')();
require('./styles.less');

var App = React.createClass({
  mixins: [User],

  getInitialState: function() {
    return {};
  },

  render: function() {
    var content;

    if (this.state.isLoggedIn)
      content = this.props.activeRouteHandler();
    else if (this.state.hasOwnProperty('isLoggedIn'))
      content = <div className='col-xs-offset-3 col-xs-6'><Login /></div>;

    return <div className='app'>
      <Nav loggedIn={!!this.state.user} />
      <div className='container'>
        <div className='row'>
          {content}
        </div>
      </div>
    </div>;
  }
});

React.renderComponent(<Routes location='history'>
  <Route handler={App}>
    <Route handler={MessagesView} />
    <Route name='message' path='message/:date' handler={MessagesView} />
  </Route>
</Routes>, document.body);
