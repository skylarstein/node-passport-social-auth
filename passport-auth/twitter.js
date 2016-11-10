/*
  twitter.js

  Passport strategy for authenticating with Twitter using the OAuth 1.0a API.
*/

'use strict';

const passport        = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User            = require('../models/user');

passport.use(new TwitterStrategy({
  consumerKey    : process.env.TWITTER_CONSUMER_KEY,
  consumerSecret : process.env.TWITTER_CONSUMER_SECRET,
  callbackURL    : process.env.BASE_URL + process.env.TWITTER_CALLBACK_PATH
},
(accessToken, refreshToken, profile, done) => {

  //console.log('Twitter profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'twitter', profileId : profile.id };

  const update = {
    platform    : 'twitter',
    profileId   : profile.id,
    screenName  : profile.username,
    displayName : profile.displayName,
    avatarUrl   : profile.photos ? profile.photos[0].value : undefined,
    lastLogin : {
      timestamp : new Date()
    }
  };

  const options = { upsert : true, new : true };

  User.findOneAndUpdate(query, update, options, (err, user) => err ? done(err) : done(null, user));
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
