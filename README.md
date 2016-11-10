#node-passport-social-auth

##A Node/Express application template with Passport social authentication

Hold me back, it's yet another MEAN template. This one tastes just right though (for now at least). Included are few nice bits that I find useful for quick starts on my random projects:

* Passport social authentication strategies supported for Facebook, Github, Google, LinkedIn, and Twitter. Keep 'em all or delete the ones you don't care about.

* Basic User model persisted to MongoDB (profile, last login timestamp).

* Both EJS and Angular front-end flavors are supported. It defaults to Angular served up as static content from /public, but if I'm not collaborating with an Angular guru I can simply define the environment variable EJS_FLAVOR for an EJS front-end party.

A basic login page will greet you. Upon successful login a basic profile page will be displayed with the profile data and avatar supplied by the selected service, including a logout button.

[<img src="/docs/screenshot.png" width="250">](https://cdn.rawgit.com/skylarstein/node-passport-social-auth/master/docs/screenshot.png)

#Top Secret Stuff

Passport social authentication strategies require client keys/secrets/ids for each desired service as well as the base URL of your application for the auth callback.

These aren't the sort of things to include in source control so I'm supplying these values via environment variables. Define these configuration variables in your runtime environment or for local use define them within a .env file at the root of the project. The .env file is included in .gitignore.

#### Running on localhost

Some social authentication strategies allow you to configure "localhost" in the auth callback URL, others do not. To run this project on your local machine, define the URL hostname as either your local hostname or give yourself a name in your hosts file: "127.0.0.1 myapp.dev"

#### Example configuration variables / .env file
```
MONGODB_CONNECT_URL=mongodb://user:password@server:port/db
SESSION_SECRET=superamazingsecretkey

BASE_URL=http://app.server.com:{optional port}

FACEBOOK_CLIENT_ID=XXX
FACEBOOK_CLIENT_SECRET=XXX
FACEBOOK_CALLBACK_PATH=/auth/callback/facebook

GITHUB_CLIENT_ID=XXX
GITHUB_CLIENT_SECRET=XXX
GITHUB_CALLBACK_PATH=/auth/callback/github

GOOGLE_CLIENT_ID=XXX
GOOGLE_CLIENT_SECRET=XXX
GOOGLE_CALLBACK_PATH=/auth/callback/google

LINKEDIN_CONSUMER_KEY=XXX
LINKEDIN_CONSUMER_SECRET=XXX
LINKEDIN_CALLBACK_PATH=/auth/callback/linkedin

TWITTER_CONSUMER_KEY=XXX
TWITTER_CONSUMER_SECRET=XXX
TWITTER_CALLBACK_PATH=/auth/callback/twitter

EJS_FLAVOR=1
```
