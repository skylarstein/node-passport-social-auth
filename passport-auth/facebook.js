/*
  facebook.js

  Passport strategy for authenticating with Facebook using the OAuth 2.0 API.
*/

'use strict';

const passport         = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User             = require('../models/user');

passport.use(new FacebookStrategy({
  clientID      : process.env.FACEBOOK_CLIENT_ID,
  clientSecret  : process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL   : process.env.BASE_URL + process.env.FACEBOOK_CALLBACK_PATH,
  profileFields : ['id', 'name', 'emails', 'displayName', 'picture.type(large)']
},
(accessToken, refreshToken, profile, done) => {

  //console.log('Facebook profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'facebook', profileId : profile.id };

  const update = {
    platform    : 'facebook',
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
