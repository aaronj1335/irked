var merge = require('lodash').merge;
var Firebase = require('firebase');
var FirebaseSimpleLogin = require('firebase-simple-login');
var eventEmitter = require('event-emitter');

var constants = require('./constants');

var auth;

/**
 * @class Auth
 *
 * the FirebaseSimpleLogin library is only simple in the "simple-minded" sense,
 * so this kind of wraps that class to make it easy for the application to work
 * with.
 *
 * since anyone can log in via oauth, we need to have a sense of 'verified',
 * that is someone that's both authenticated via oath and authorized to view
 * the logs. so the user will be in one of 3 states:
 *
 * - not authed
 *     (auth.isAuthed() => false)
 *
 * - authed, but not authorized:  in practical terms, this means their
 *   /users/<id> object in the firebase doesn't have 'verified: true'
 *     (auth.isAuthed() => true, auth.isAuthedAndVerified() => false)
 *
 * - authed and authorized: we define this as "logged in"
 *     (auth.isAuthed() => true, auth.isAuthedAndVerified() => true)
 *
 * the Auth class is an EventEmitter, so whenever the user changes between one
 * of the above states, the Auth instance emits an 'authchange' event.
 *
 * most use cases will just care if the user is logged in, so checking
 * auth.isLoggedIn() (synonym for auth.isAuthedAndVerified()) is fine. but if
 * something, for example a login form, needs more information about things
 * like failure states, methods like auth.error() and auth.user() are provided.
 */
function Auth() {
  var fbRef = new Firebase(constants.FIREBASE_URL);

  eventEmitter(this);
  this._onAuth = this._onAuth.bind(this);
  this._authRef = new FirebaseSimpleLogin(fbRef, this._onAuth);
}

Auth.prototype._reconcileAuthRef = function() {
  var url;

  if (this._authResult) {
    url = constants.FIREBASE_URL + '/users/' + this.userId();
    this._userRef = new Firebase(url);
    this._userRef.on('value', this._onUser.bind(this), function(error) {
      this._error = error;
      this.emit('authchange');
    }.bind(this));
  } else {
    if (this._userRef) {
      this._userRef.off('value');
      delete this._userRef;
    }

    this.emit('authchange');
  }
};

Auth.prototype._onAuth = function(error, result) {
  this._error = error;
  this._authResult = result;
  delete this._user;
  this._reconcileAuthRef();
};

Auth.prototype._onUser = function(snapshot) {
  this._user = snapshot.val();
  this.emit('authchange');
};

Auth.prototype.error = function() {
  return this._error;
};

Auth.prototype.isAuthed = function() {
  return !!this._authResult;
};

Auth.prototype.isAuthedAndVerified = function() {
  return !!(this._authResult && this._user);
};

// for convenience and clarity
Auth.prototype.isLoggedIn = function() {
  return this.isAuthedAndVerified();
};

Auth.prototype.login = function() {
  this._authRef.login.apply(this._authRef, arguments);
};

Auth.prototype.logout = function() {
  this._authRef.logout();
};

Auth.prototype.userId = function() {
  return this._authResult.uid;
};

Auth.prototype.userInfo = function() {
  return merge({}, this._authResult);
};

module.exports = function() {
  if (!auth)
    auth = new Auth();

  return auth;
};

module.exports.reset = function() {
  auth = null;
};

