var _ = require('lodash');
var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var FirebaseSimpleLogin = require('firebase-simple-login');

var constants = require('./../../constants');
var uniqueHtmlId = require('./../../util/unique-html-id');

module.exports = React.createClass({
  mixins: [ReactFire],

  _auth: function() {
    if (!this._authRef) {
      var fbRef = new Firebase(constants.FIREBASE_URL);
      var onLogin = this.onLogin;

      // we've got to do this stupid thing with onLogin because firebase
      // apparently calls onLogin.bind with something other than the component
      // instance, which triggers weird warnings in the console
      this._authRef = new FirebaseSimpleLogin(fbRef, ()=>
                                              onLogin.apply(this, arguments));
    }

    return this._authRef;
  },

  // disable: function() {
  //   _.each(this.getDOMNode().elements, function(el) {
  //     el.disabled = true;
  //   });
  // },

  // enable: function() {
  //   _.each(this.getDOMNode().elements, function(el) {
  //     el.disabled = false;
  //   });
  // },

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

  onLogin: function(error/*, user*/) {
    if (this.isMounted()) {
      this.setState({disabled: false});

      if (error && this.isMounted())
        this.setState({error});
    }
  },

  onSubmit: function(event) {
    var newState = _.merge({disabled: true}, this.state);

    event.preventDefault();
    delete newState.error;
    this.replaceState(newState);
    this._auth().login('password', {
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value,
      rememberMe: true
    });
  },

  render: function() {
    var alert;

    if (this.state.error)
      alert = <div className='alert alert-warning' role='alert'>
        {this.state.error.message.replace(/^[^:]*:/, '')}
      </div>;

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
      {alert}
    </form>;
  }
});
