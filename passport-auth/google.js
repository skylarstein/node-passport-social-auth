/*
  google.js

  Passport strategies for authenticating with Google using OAuth 1.0a and OAuth 2.0.
*/

'use strict';

const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User           = require('../models/user');

passport.use(new GoogleStrategy({
  clientID     : process.env.GOOGLE_CLIENT_ID,
  clientSecret : process.env.GOOGLE_CLIENT_SECRET,
  callbackURL  : process.env.BASE_URL + process.env.GOOGLE_CALLBACK_PATH
},
(accessToken, refreshToken, profile, done) => {

  //console.log('Google profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'google', profileId : profile.id };

  const update = {
    platform    : 'google',
    profileId   : profile.id,
    email       : profile.emails ? profile.emails[0].value : undefined,
    displayName : profile.displayName,
    givenName   : profile.name.givenName,
    familyName  : profile.name.familyName,
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
