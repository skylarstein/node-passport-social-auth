/*
  linkedin.js

  Passport strategy for authenticating with LinkedIn using the OAuth 1.0a API.
*/

'use strict';

const passport         = require('passport');
const LinkedInStrategy = require('passport-linkedin');
const User             = require('../models/user');

passport.use(new LinkedInStrategy({
  consumerKey    : process.env.LINKEDIN_CONSUMER_KEY,
  consumerSecret : process.env.LINKEDIN_CONSUMER_SECRET,
  callbackURL    : process.env.BASE_URL + process.env.LINKEDIN_CALLBACK_PATH,
  profileFields  : ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
},
(token, tokenSecret, profile, done) => {

  //console.log('LinkedIn profile:', JSON.stringify(profile, null, 2));

  const query = { platform : 'linkedin', profileId : profile.id };

  const update = {
    platform    : 'linkedin',
    profileId   : profile.id,
    displayName : profile.displayName,
    givenName   : profile.name.givenName,
    familyName  : profile.name.familyName,
    email       : profile.emails ? profile.emails[0].value : undefined,
    avatarUrl   : profile._json.pictureUrl,
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
