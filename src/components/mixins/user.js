var _ = require('lodash');
var Firebase = require('firebase');

var auth = require('./../../auth')();
var constants = require('./../../constants');

module.exports = {
  _reconcileAuthRef: function() {
    var url;

    if (auth.isLoggedIn()) {
      url = constants.FIREBASE_URL + '/users/' + auth.userId();
      this._userRef = new Firebase(url);
      this._userRef.on('value', function (snapshot) {
        this.onUser(snapshot.val());
      }.bind(this));
    } else if (this._userRef) {
      this._userRef.off('value');
      delete this._userRef;
    }
  },

  componentDidMount: function() {
    auth.on('authchange', this.onAuthChange);
    this._reconcileAuthRef();
  },

  componentWillUnmount: function() {
    auth.off('authchange', this.onAuthChange);

    if (this._userRef)
      this._userRef.off('value');
  },

  onAuthChange: function() {
    var newState = _.merge(this.state, {
      isLoggedIn: auth.isLoggedIn()
    });

    if (!newState.isLoggedIn)
      delete newState.user;

    if (this.isMounted())
      this.replaceState(newState);

    this._reconcileAuthRef();
  },

  onUser: function(user) {
    this.setState({user: user});
  }
};
