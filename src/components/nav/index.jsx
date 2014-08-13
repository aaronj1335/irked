var React = require('react');
var Firebase = require('firebase');

var User = require('./../mixins/user');
var constants = require('./../../constants');
var auth = require('./../../auth')();

require('./style.less');

var Nav = React.createClass({
  mixins: [User],

  _renderDropdown: function() {
    if (this.state.user)
      return <ul className='nav navbar-nav navbar-right'>
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

  render: function() {
    return (
      <div className='navbar navbar-inverse navbar-fixed-top' role='navigation'>
        <div className='container-fluid'>
          {/* Brand and toggle get grouped for better mobile display */}
          {/*}
          <div className='navbar-header'>
            <a className='navbar-brand' href='/'></a>
          </div>
          {*/}

          {/* Collect the nav links, forms, and other content for toggling */}
          <div className='collapse navbar-collapse'>
            {this._renderDropdown()}

            {/*}
            <form className='navbar-form navbar-right' role='search'>
              <div className='form-group'>
                <input type='search'
                  className='form-control'
                  placeholder='Search' />
              </div>
            </form>
            {*/}

          </div>{/* /.navbar-collapse */}
        </div>{/* /.container-fluid */}
      </div>
    );
  }
});

module.exports = Nav;
