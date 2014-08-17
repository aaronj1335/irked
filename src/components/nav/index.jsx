var React = require('react');
var Firebase = require('firebase');
var {Link} = require('react-router');

var User = require('./../mixins/user');
var SearchBox = require('./../search-box/index.jsx');
var constants = require('./../../constants');
var auth = require('./../../auth')();
var isChildOf = require('./../../util/is-child-of');

require('./style.less');

var Nav = React.createClass({
  mixins: [User],

  _renderDropdown: function() {
    if (this.state.user)
      return <ul className='nav navbar-nav navbar-right' ref='dropdown'>
        <li className={this.state.open? 'dropdown open' : 'dropdown'}>
          <a href='#'
              className='dropdown-toggle'
              onClick={this.onDropdownClick}>
            {this.state.user.displayName}{' '}
            {this.state.user.avatar?
              <img className='avi' src={this.state.user.avatar} /> : ''}
          </a>
          <ul className='dropdown-menu' role='menu'>
            <li>
              <a onClick={this.onClickLogout} href='#'>Log Out</a>
            </li>
          </ul>
        </li>
      </ul>;
  },

  _renderSearch: function() {
    if (this.state.user)
      return <SearchBox className='navbar-form navbar-left' />;
  },

  componentDidUpdate: function() {
    if (this.state.open)
      window.addEventListener('mousedown', this.onWindowMousedown);
    else
      window.removeEventListener('mousedown', this.onWindowMousedown);
  },

  getInitialState: function() {
    return {open: false};
  },

  onClickLogout: function(event) {
    event.preventDefault();
    auth.logout();
    this.setState({open: false});
  },

  onDropdownClick: function(event) {
    event.preventDefault();
    this.setState({open: !this.state.open});
  },

  onWindowMousedown: function(event) {
    var isInDropdown = isChildOf(event.target, this.refs.dropdown.getDOMNode());

    if (!isInDropdown)
      this.setState({open: false});
  },

  render: function() {
    return (
      <div className='navbar navbar-inverse navbar-fixed-top' role='navigation'>
        <div className='container'>
          {/* Brand and toggle get grouped for better mobile display */}
          <div className='navbar-header'>
            <Link to='home' className='navbar-brand'>
              IRKED
            </Link>
          </div>

          {/* Collect the nav links, forms, and other content for toggling */}
          <div className='collapse navbar-collapse'>
            {this._renderSearch()}
            {this._renderDropdown()}
          </div>{/* /.navbar-collapse */}
        </div>{/* /.container-fluid */}
      </div>
    );
  }
});

module.exports = Nav;
