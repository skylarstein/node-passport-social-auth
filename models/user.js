/*
  user.js
*/

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

  platform    : String,
  profileId   : String,
  displayName : String,
  givenName   : String,
  familyName  : String,
  screenName  : String,
  avatarUrl   : String,
  email       : String,
  lastLogin : {
    timestamp : { type : Date, default : undefined }
  }

});

module.exports = mongoose.model('users', User);
