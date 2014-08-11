var _ = require('lodash');

var UserMixin = require('./components/mixins/user');
var auth = require('./auth')();

var newUserMaker;

function emailFromUserInfo(user) {
  if (user.provider === 'password')
    return user.email;
  else if (user.provider === 'github')
    return _.find(user.thirdPartyUserData.emails, function(item) {
      return item.primary;
    }).email;
  else
    throw new Error('could not get email ' + JSON.stringify(user, null, 2));
}

function avatarFromUserInfo(user) {
  if (user.provider === 'github')
    return user.thirdPartyUserData.avatar_url;
  else
    return null;
}

function displayNameFromUserInfo(user) {
  if (user.provider === 'github')
    return user.displayName;
  else
    return emailFromUserInfo(user);
}

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
    email: emailFromUserInfo(user),
    avatar: avatarFromUserInfo(user),
    displayName: displayNameFromUserInfo(user),
    providerInfo: user
  };
};

NewUserMaker.prototype.isMounted = function() {
  return true;
};

NewUserMaker.prototype.replaceState = function(newState) {
  this.state = newState;

  if (auth.isLoggedIn() && this.state.hasOwnProperty('user') &&
      !this.state.user.providerInfo)
    this._userRef.update(this._makeUser());
};

NewUserMaker.prototype.setState = function(stateUpdate) {
  this.replaceState(_.merge(this.state, stateUpdate));
};

module.exports = function() {
  if (!newUserMaker)
    newUserMaker = new NewUserMaker();

  return newUserMaker;
};

// FOR REFERENCE
//
// github userInfo:
// {
//   "id": "787066",
//   "uid": "github:787066",
//   "displayName": "Aaron Stacy",
//   "provider": "github",
//   "thirdPartyUserData": {
//     "login": "aaronj1335",
//     "id": 787066,
//     "avatar_url": "https://avatars.githubusercontent.com/u/787066?v=2",
//     "gravatar_id": "d7cd2f1a2616bb166c30f43866415cdd",
//     "url": "https://api.github.com/users/aaronj1335",
//     "html_url": "https://github.com/aaronj1335",
//     "followers_url": "https://api.github.com/users/aaronj1335/followers",
//     "following_url": "https://api.github.com/users/aaronj1335/following{/other_user}",
//     "gists_url": "https://api.github.com/users/aaronj1335/gists{/gist_id}",
//     "starred_url": "https://api.github.com/users/aaronj1335/starred{/owner}{/repo}",
//     "subscriptions_url": "https://api.github.com/users/aaronj1335/subscriptions",
//     "organizations_url": "https://api.github.com/users/aaronj1335/orgs",
//     "repos_url": "https://api.github.com/users/aaronj1335/repos",
//     "events_url": "https://api.github.com/users/aaronj1335/events{/privacy}",
//     "received_events_url": "https://api.github.com/users/aaronj1335/received_events",
//     "type": "User",
//     "site_admin": false,
//     "name": "Aaron Stacy",
//     "company": "Waterfall",
//     "blog": "aaronstacy.com",
//     "location": "Austin, Texas",
//     "email": "",
//     "hireable": false,
//     "bio": null,
//     "public_repos": 66,
//     "public_gists": 63,
//     "followers": 16,
//     "following": 4,
//     "created_at": "2011-05-13T23:14:21Z",
//     "updated_at": "2014-08-11T00:15:52Z",
//     "emails": [
//       {
//         "email": "aaron.stacy@utexas.edu",
//         "primary": false,
//         "verified": true
//       },
//       {
//         "email": "aaron@waterfall.com",
//         "primary": false,
//         "verified": true
//       },
//       {
//         "email": "aaron.r.stacy@gmail.com",
//         "primary": true,
//         "verified": true
//       }
//     ]
//   },
//   "accessToken": "...",
//   "username": "aaronj1335",
//   "firebaseAuthToken": "..."
// }


// email&password userInfo:
// {
//   "provider": "password",
//   "id": "3",
//   "uid": "simplelogin:3",
//   "email": "aaron.r.stacy@icloud.com",
//   "md5_hash": "...",
//   "isTemporaryPassword": false,
//   "firebaseAuthToken": "..."
// }
