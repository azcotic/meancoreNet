'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk');

 function arturodb(db) {
  console.log("Conexión exitosa de arturodb");
  //Consultas a la BD
  //console.log(db.connect());
  //mongoose.disconnect();
   return new Promise(function (resolve, reject) {})
 }; 

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    express.initAllApps(db, function (app) {
      if (callback) callback(app, config);
    });
  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, config) {
    //Conexión MONGODB
  mongoose.connect(async () => {
    mongoose.loadModels();
      //console.log("apunto de conectarme");
      


      arturodb(mongoose)
        .then(function () {
          // Disconnect and finish task
          mongoose.disconnect((disconnectError) => {
            if (disconnectError) {
              console.log('Error disconnecting from the database.HOLA');
              // Finish task with error
              console.error(disconnectError);
            }
          });
        })
        .catch((err) => {
          mongoose.disconnect((disconnectError) => {
            if (disconnectError) {
              console.log('HOLAError disconnecting from the database, but was preceded by a Mongo Seed error.');
            }

            // Finish task with error
            console.error(err);
          });
        });
   });




    // Start the app by listening on <port> at <host>
    var server = app
    


    .listen(config.port, config.host, function () {

      process.stdin.resume(); //so the program will not close instantly

      function exitHandler(options, err) {
        if (options.cleanup) console.log('clean');
        if (err) console.log(err.stack);
        if (options.exit) process.exit();
      }

      //do something when app is closing
      process.on('exit', exitHandler.bind(null, {
        cleanup: true
      }));
      //catches ctrl+c event
      process.on('SIGINT', exitHandler.bind(null, {
        exit: true
      }));
      process.on('SIGABRT', exitHandler.bind(null, {
        exit: true
      }));
      // catches "kill pid" (for example: nodemon restart)
      process.on('SIGUSR1', exitHandler.bind(null, {
        exit: true
      }));
      process.on('SIGUSR2', exitHandler.bind(null, {
        exit: true
      }));
      //catches uncaught exceptions
      process.on('uncaughtException', exitHandler.bind(null, {
        exit: true
      }));

      // Create server URL
      var server = (config.secure && config.secure.ssl ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.mongoDB.uri));
      console.log(chalk.green('App version:     ' + config.meancore.version));
      console.log(chalk.green('Todo listo Arturo, ¡Vamos a darle en las costillas!'));
      console.log('--');

      if (callback) callback(app, config);
    });
    

   
    
    server.timeout = 10 * 60 * 1000; // 10 mins
  });
};
