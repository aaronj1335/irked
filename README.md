# irc logging app

simple irc logging app that:

- is cheap and easy to host
- allows us to [deep link][] to conversations
- has good search
- requires a login so the team's conversations aren't public

### cheap and easy to host

the data lives in [firebase][] and [searchly][]. the app itself is just static html and css, so i'm hosting that on [github pages][]. i've got [travis-ci configured][travisyml] to deploy to github pages on every commit with [this little shell script][deploy].

the only tough part is updating the data. i've got a little irc-bot script that pushes data to the firebase which looks something like this (we use [hubot][]):

```coffee
Firebase = require 'firebase'

messageObject = (msg)->
  date = new Date()
  o = {}
  o[date.valueOf().toString()] =
    date: date
    from: msg.user.id
    message: msg.text
  o

module.exports = (robot)->
  url = "https://our-firebase.firebaseio.com/logs/channels/waterfall"
  if process.env.FIREBASE_SECRET
    fb = new Firebase(url)
    fb.auth process.env.FIREBASE_SECRET
    robot.hear /.*/, (heard)->
      if heard.message.room == "#ourchannel"
        obj = messageObject heard.message
        fb.update obj
```

additionally, the app uses a [firebase search queue][fbsearch], so we need a little process that processes the queue. this lives in [`lib/searchd.js`][searchd], and we run it on the same box with our irc bot. you can start/stop/restart it in the normal `npm` way:

```text
npm start
# logs and pid file are found in ./logs
npm restart
npm stop
```

### deep linking conversations

links to every message show up next to the message text. we've found that it's important to remember where and how decisions were made, even when that happens outside of e-mail.

### good search

the messages are indexed and searchable with searchly/elasticsearch/lucene. we've got about seven thousand messages, and we're not even close to the limit for a free instance.

the index is probably horribly wrong, but it's close, and the infrastructure is in place to improve it. [the code specifying the search query][searchd] could also be improved to add gmail-like search syntax.

### required login

since everything from the app goes through firebase, it is used to control permissions. we use github login, but only certain profiles are given access to the information. we have firebase rules that look something like:

```json
{
  "rules": {
    "logs": {
      ".read": "auth != null && root.child('users/' + auth.uid + '/verified').val() === true",
```

and when we want to give a certain github profile access to the info, we add an item to the `users` object like this:

```json
{
  "users": {
    "github:<github profile id number>": {
      "verified": true
    },
```

there's also [a utility][verify-gh-user] for doing this:

```txt
bin/verify-gh-user -s <firebase secret> aaronj1335
```

## setting it all up

1. generate some data from existing logs: obviously this is optional, but [there's an example][generate] in the repo
2. create a firebase, and add the data from step 1
3. add some github users with `bin/add-gh-user`
4. add the firebase url to [the `constants` file][constants]
5. start the dev server with `npm run dev` &mdash; at this point you can visit http://localhost:8000 and see the logs
6. create a searchly account, and add the url to [the `constants` file][constants]
7. create the searchly index from firebase. the repo has [an example of this][index] as well
8. export the `FIREBASE_SECRET` and `SEARCHLY_API_KEY` variables
9. start the queue processor with `npm start`

## the firebase data

the firebase data looks something like this:

```json
{
  "users": {
    "simplelogin:1": {
      "email": "...",
      "id": "simplelogin:1",
      ...
    }
  },

  "logs": {
    "channels": {
      "foo": {
        "<unix timestamp>": {
          "from": "aaronj1335",
          "message": "pizza butts",
          "date": "<iso 8601 timestamp>"
        },
        ...
      }
    }
  }
}
```

[github pages]: https://pages.github.com
[firebase]: https://www.firebase.com
[searchly]: http://www.searchly.com
[deep link]: http://en.wikipedia.org/wiki/Deep_linking
[travisyml]: https://github.com/aaronj1335/irked/blob/master/.travis.yml
[deploy]: https://github.com/aaronj1335/irked/blob/master/bin/deploy
[hubot]: https://github.com/github/hubot
[fbsearch]: https://www.firebase.com/blog/2014-01-02-queries-part-two.html
[searchd]: https://github.com/aaronj1335/irked/blob/master/lib/searchd.js
[verify-gh-user]: https://github.com/aaronj1335/irked/blob/master/bin/verify-gh-user
[generate]: https://github.com/aaronj1335/irked/blob/master/bin/generate-firebase-json.js
[constants]: https://github.com/aaronj1335/irked/blob/master/src/constants.js
[example]: https://github.com/aaronj1335/irked/blob/master/bin/add-documents-to-elasticsearch-index.js
