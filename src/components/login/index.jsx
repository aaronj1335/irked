var _ = require('lodash');
var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');

var constants = require('./../../constants');
var uniqueHtmlId = require('./../../util/unique-html-id');
var auth = require('./../../auth')();

module.exports = React.createClass({
  mixins: [ReactFire],

  componentDidMount: function() {
    auth.on('authchange', this.onAuthChange);
  },

  componentWillUnmount: function() {
    auth.off('authchange', this.onAuthChange);
  },

  formGroupClassName: function(group) {
    var className = 'form-group';

    if (!this.state.error)
      return className;

    if (group === 'email' && /email/i.test(this.state.error.code))
      className += ' has-error';
    if (group === 'password' && /password/i.test(this.state.error.code))
      className += ' has-error';

    return className;
  },

  getInitialState: function() {
    return {
      disabled: false,
      emailId: uniqueHtmlId(),
      passwordId: uniqueHtmlId()
    };
  },

  makeAlert: function() {
    var verify = 'Your account needs to be verified. By an admin or whatever.';

    if (this.state.error)
      return <div className='alert alert-warning' role='alert'>
        {auth.isAuthed()?
          verify : this.state.error.message.replace(/^[^:]*:/, '')}
      </div>;
  },

  onClickLoginWithGitHub: function(event) {
    event.preventDefault();

    auth.login('github', {
      rememberMe: true,
      scope: 'user:email'
    });
  },

  onAuthChange: function() {
    if (this.isMounted()) {
      this.setState({disabled: false});

      if (auth.error() && this.isMounted())
        this.setState({error: auth.error()});
    }
  },

  onSubmit: function(event) {
    var newState = _.merge({disabled: true}, this.state);

    event.preventDefault();
    delete newState.error;
    this.replaceState(newState);
    auth.login('password', {
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value,
      rememberMe: true
    });
  },

  render: function() {
    return <form role='form' onSubmit={this.onSubmit}>
      <div className={this.formGroupClassName('email')}>
        <label className='control-label' htmlFor={this.state.emailId}>
          Email address
        </label>
        <input
          type='email'
          className='form-control'
          id={this.state.emailId}
          ref='email'
          placeholder='Enter email'
          disabled={this.state.disabled}
          required
          autoFocus />
      </div>
      <div className={this.formGroupClassName('password')}>
        <label className='control-label' htmlFor={this.state.passwordId}>
          Password
        </label>
        <input
          type='password'
          className='form-control'
          id={this.state.passwordId}
          ref='password'
          placeholder='Password'
          disabled={this.state.disabled}
          required />
      </div>
      <div className='form-group'>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </div>
      <hr />
      <div className='form-group text-center'>
        Or,{' '}
        <a className='btn btn-primary' href="#" onClick={this.onClickLoginWithGitHub}>
          Log in with GitHub
        </a>
      </div>
      {this.makeAlert()}
    </form>;
  }
});
