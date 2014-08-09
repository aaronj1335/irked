var _ = require('lodash');

var UserMixin = require('./components/mixins/user');
var auth = require('./auth')();

var newUserMaker;

function NewUserMaker() {
  for (var prop in this)
    if (prop.slice(0, 2) === 'on')
      this[prop] = this[prop].bind(this);

  this.state = {};
  this.componentDidMount();
}

NewUserMaker.prototype = Object.create(UserMixin);

NewUserMaker.prototype._makeUser = function() {
  var user = auth.userInfo();

  return {
    id: user.uid,
    provider: user.provider,
    email: user.email
  };
};

NewUserMaker.prototype.isMounted = function() {
  return true;
};

NewUserMaker.prototype.replaceState = function(newState) {
  this.state = newState;

  if (auth.isLoggedIn() && this.state.hasOwnProperty('user') &&
      !this.state.user)
    this._userRef.set(this._makeUser());
};

NewUserMaker.prototype.setState = function(stateUpdate) {
  this.replaceState(_.merge(this.state, stateUpdate));
};

module.exports = function() {
  if (!newUserMaker)
    newUserMaker = new NewUserMaker();

  return newUserMaker;
};
