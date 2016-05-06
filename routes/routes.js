/*
  routes.js

  Configure routes for our application.
*/

'use strict';

const express = require('express');
const router  = express.Router();
const _       = require('underscore');

router.get('/', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.render('profile.ejs', { user : _.omit(req.user.toObject(), ['_id', '__v']) });
  }
  else {
    res.render('login.ejs');
  }
});

module.exports = router;
