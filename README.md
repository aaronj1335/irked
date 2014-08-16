# irc logging app

this is meant to be hosted on gh-pages and hooked up to a free firebase cause who's got money to spend on hosting an irc logger anyway.

## adding new logs

you have to import logs into the firebase, which looks something like:

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
        "<unix timestamp": {
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

it doesn't automatically update the logs unfortunately, so maybe write a plugin for your bot or something i dunno.

## development

just clone and run `npm install && npm run dev` for the development server. it runs at [localhost:8000](http://localhst:8000).

## deployment

this is currenly deployed to [its own github project page](http://aaronj1335.github.io/irked/). to deploy your own:

- fork it
- clone your fork
- run `bin/deploy`

if you turn on travis for your fork, it will automatically deploy every time you push to master.
