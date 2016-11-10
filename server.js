/*
  server.js

  The main entry point for our application
*/

'use strict';

// Sensitive/secret configuration variables can be loaded via a local .env file
// or via environment variable configuration in your production environment.
//
require('node-env-file')(`${__dirname}/.env`, { raise : false } );

const app        = require('./app.js');
const os         = require('os');
const http       = require('http');
const appPackage = require('./package.json');
const port       = process.env.PORT || 3003;

// Start our server
//
const httpServer = http.createServer(app).listen(port);

httpServer.on('listening', () => {
  console.log(`Welcome to ${appPackage.description} v${appPackage.version}`);
  console.log(`Node ${process.version}, ${os.platform()}/${os.arch()}`);

  const addr = httpServer.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

  console.log(`HTTP server listening on ${bind} on ${os.hostname()}`);
});

httpServer.on('error', error => {
  if(error.syscall !== 'listen') {
    throw error;
  }

  const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

  switch(error.code) {

    case 'EACCES':
      console.error(`ERROR: ${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`ERROR: ${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
});

// Clean shutdown
//
const cleanShutdown = shutdownType => {
  console.log(`[${shutdownType}] Initiating graceful shutdown...`);

  httpServer.close(() => {
    console.log('HTTP server closed remaining connections. Exiting now.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => cleanShutdown('SIGTERM'));
process.on('SIGINT', () => cleanShutdown('SIGINT'));

module.exports = app; // for testing

