/*
  app.js

  Our Express app
*/

'use strict';

const express     = require('express');
const session     = require('express-session');
const path        = require('path');
const logger      = require('morgan');
const bodyParser  = require('body-parser');
const passport    = require('passport');
const mongoose    = require('mongoose');
const mongoStore  = require('connect-mongo')(session);
const compression = require('compression');

class App {

  constructor() {
    this.app = express();

    this._connectDatabase();
    this._initMiddleware();
    this._initRoutes();
  }

  // For the sake of clean code I'm not going out of my way to make these private
  // beyond suggesting that they are private with the underscore-prefix naming convention.
  //
  _connectDatabase() {
    mongoose.connect(process.env.MONGODB_CONNECT_URL);    
  }

  _initMiddleware() {
    this.app.use(logger('dev'));
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended : true }));
    this.app.use(compression());

    this.app.use(session({
      secret : process.env.SESSION_SECRET, // $ openssl rand -base64 32
      resave : false,            // Don't save unmodified sessions
      saveUninitialized : false, // Just like it sounds like, don't save unitilized login sessions
      store : new mongoStore({   // Persist cookies across server restarts
        url : process.env.MONGODB_CONNECT_URL,
        ttl : 24 * 60 * 60,
        autoRemove : 'native'    // Allow MongoDB's TTL collection feature to automatically remove expired sessions
      }),
      cookie : {
        httpOnly  : true,        // Disallow client side script access to the cookie
        ephemeral : true,        // Delete cookie when the browser is closed
        secure    : false,       // Allow insecure cookies for initial testing, but this should be true. HTTPS all the things! 
      }
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  _initRoutes() {
    // This first route will redirect Heroku traffic to https if I find the Heroku header.
    //
    this.app.use(function(req, res, next) {

      if(req.headers && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] != 'https') {
        res.redirect(301, `https://${req.hostname}${req.originalUrl}`); // 301 Moved Permanently
      }
      else {
        next();
      }
    });

    this.app.use('/', require('./routes/routes.js'));
    this.app.use('/', require('./routes/routes-auth.js'));

    this.app.use(express.static(`${__dirname}/public`));

    // Route not found handler (404). This is the last route we'll add to our middleware stack.
    // If we make it this far we know no other route handled the request.
    //
    this.app.use((req, res) =>
    {
      res.status(404).render('error.ejs', {
        title   : 'Yeah, wow. I have no idea where that is.',
        code    : '404',
        message : `${req.method} ${req.headers.host}${req.url}`,
        stack   : ''
      });
    });

    // Unhandled errors (500)
    //
    this.app.use((error, req, res, next) =>
    {
      res.status(500).render('error.ejs', {
        title   : `Yeah, that's broken.`,
        code    : '500',
        message : `${req.method} ${req.headers.host}${req.url}`,
        stack   : this.app.get('env') === 'development' ? error.stack : ''
      });
    });
  }
}

module.exports = new App().app;
