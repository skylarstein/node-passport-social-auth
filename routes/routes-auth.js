/*
  auth-routes.js

  Configure authentication routes for our application.
*/

'use strict';

const express          = require('express');
const router           = express.Router();
const passportLinkedIn = require('../passport-auth/linkedin.js');
const passportGithub   = require('../passport-auth/github.js');
const passportTwitter  = require('../passport-auth/twitter.js');
const passportGoogle   = require('../passport-auth/google.js');
const passportFacebook = require('../passport-auth/facebook.js');

router.post('/auth/logout', (req, res, next) => {
  req.logout();
  res.status(200).send('OK');
});

const authSuccessRedirect = '/';
const authFailureRedirect = '/';

// Facebook
//
router.get('/auth/facebook', passportFacebook.authenticate('facebook', { scope: [ 'public_profile', 'email' ] }));

router.get(process.env.FACEBOOK_CALLBACK_PATH,
  passportFacebook.authenticate('facebook', {
    failureRedirect : authFailureRedirect,
    successRedirect : authSuccessRedirect
  }));

// Github
//
router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

router.get(process.env.GITHUB_CALLBACK_PATH,
  passportGithub.authenticate('github', {
    failureRedirect : authFailureRedirect,
    successRedirect : authSuccessRedirect
  }));

// Google
//
router.get('/auth/google', passportGoogle.authenticate('google', { scope: [ 'profile', 'email' ] }));

router.get(process.env.GOOGLE_CALLBACK_PATH,
  passportGoogle.authenticate('google', {
    failureRedirect : authFailureRedirect,
    successRedirect : authSuccessRedirect
  }));

// LinkedIn
//
router.get('/auth/linkedin', passportLinkedIn.authenticate('linkedin', { scope : ['r_basicprofile', 'r_emailaddress'] }));

router.get(process.env.LINKEDIN_CALLBACK_PATH,
  passportLinkedIn.authenticate('linkedin', {
    failureRedirect : authFailureRedirect,
    successRedirect : authSuccessRedirect
  }));

// Twitter
//
router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get(process.env.TWITTER_CALLBACK_PATH,
  passportTwitter.authenticate('twitter', {
    failureRedirect : authFailureRedirect,
    successRedirect : authSuccessRedirect
  }));

module.exports = router;
