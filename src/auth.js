var _ = require('lodash');
var Firebase = require('firebase');
var FirebaseSimpleLogin = require('firebase-simple-login');
var eventEmitter = require('event-emitter');

var constants = require('./constants');

var auth;

function Auth() {
  var fbRef = new Firebase(constants.FIREBASE_URL);

  eventEmitter(this);
  this._onAuth = this._onAuth.bind(this);
  this._authRef = new FirebaseSimpleLogin(fbRef, this._onAuth);
}

Auth.prototype._onAuth = function(error, result) {
  this._authResult = result;
  this.emit('authenticated');
};

Auth.prototype.isLoggedIn = function() {
  return !!this._authResult;
};

Auth.prototype.logout = function() {
  this._authRef.logout();
};

Auth.prototype.userId = function() {
  return this._authResult.uid;
};

Auth.prototype.userInfo = function() {
  return _.merge({}, this._authResult);
};

module.exports = function() {
  if (!auth)
    auth = new Auth();

  return auth;
};

module.exports.reset = function() {
  auth = null;
};

