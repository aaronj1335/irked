var React = require('react');
var Router = require('react-router');
var {Routes, Route} = Router;

var Login = require('./components/login/index.jsx');
var User = require('./components/mixins/user');
var Nav = require('./components/nav/index.jsx');
var Messages = require('./components/messages/index.jsx');
var MessagesView = require('./components/messages-view/index.jsx');
var SearchView = require('./components/search-view/index.jsx');
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
        {content}
      </div>
    </div>;
  }
});

// allow the code to use /irked as a base, since i'm cheap and i like deploying
// from gh-pages
var root = /^\/irked\//.test(location.pathname)? '/irked/#/' : '/';
// if we're deployed to gh-pages, then we need to use hash routing since it's
// just a simple static file server
var loc = /irked/.test(root)? 'hash' : 'history';

React.renderComponent(<Routes location={loc}>
  <Route path={root}                     handler={App}>
    <Route path={root}                   handler={MessagesView} name='home' />
    <Route path={root + 'message/:date'} handler={MessagesView} name='message' />
    <Route path={root + 'search'}        handler={SearchView}   name='search' />
  </Route>
</Routes>, document.body);

window.React = React;
