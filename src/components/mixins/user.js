var _ = require('lodash');
var Firebase = require('firebase');

var auth = require('./../../auth')();
var constants = require('./../../constants');

module.exports = {
  componentDidMount: function() {
    auth.on('authenticated', this.onAuthenticatedChange);
  },

  componentWillUnmount: function() {
    auth.off('authenticated', this.onAuthenticatedChange);

    if (this._userRef)
      this._userRef.off('value');
  },

  onAuthenticatedChange: function() {
    var newState = _.merge(this.state, {
      isLoggedIn: auth.isLoggedIn()
    });
    var url;

    if (!newState.isLoggedIn)
      delete newState.user;

    if (this.isMounted())
      this.replaceState(newState);

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

  onUser: function(user) {
    this.setState({user: user});
  }
};
