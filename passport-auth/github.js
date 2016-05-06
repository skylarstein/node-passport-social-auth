/*
  github.js

  Passport strategy for authenticating with GitHub using the OAuth 2.0 API
*/

'use strict';

const passport       = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User           = require('../models/user');

passport.use(new GitHubStrategy({
    clientID     : process.env.GITHUB_CLIENT_ID,
    clientSecret : process.env.GITHUB_CLIENT_SECRET,
    callbackURL  : process.env.BASE_URL + process.env.GITHUB_CALLBACK_PATH
  },
  (accessToken, refreshToken, profile, done) => {

    //console.log('Github profile:', JSON.stringify(profile, null, 2));

    const query = { platform : 'github', profileId : profile.id };

    const update = {
      platform    : 'github',
      profileId   : profile.id,
      displayName : profile.displayName,
      email       : profile.emails ? profile.emails[0].value : undefined,
      screenName  : profile.username,
      avatarUrl   : profile._json.avatar_url,
      lastLogin : {
        timestamp : new Date()
      }
    };

    const options = { upsert : true, new : true };

    User.findOneAndUpdate(query, update, options, (err, user) => err ? done(err) : done(null, user));
  }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user))
});

module.exports = passport;
