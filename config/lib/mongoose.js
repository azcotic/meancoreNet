'use strict';

/**
 * Module dependencies.
 */
 
var config = require('../config'),
  _ = require('lodash'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose');
var Schema = mongoose.Schema;

  var PolloSchema = new Schema({
   firstName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  }
 });

 PolloSchema.statics.findUser = function (firstName, callback) {
  console.log(firstName);
  var _this = this;  
  _this.findOne({
    firstName: firstName
  }).exec(function (err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      return callback('Failed to load Pollo ' + firstName);
    }
    callback(null, user);
  });
};

 mongoose.model('Pollo', PolloSchema);

exports.comerPollo = function(req, res) {
  PolloSchema.statics.findUser(10);
};

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};


// Initialize Mongoose
module.exports.connect = function (callback) {
  mongoose.Promise = config.mongoDB.promise;

  mongoose
    .connect(config.mongoDB.uri, config.mongoDB.options)
    .then(function (connection) {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.mongoDB.debug);
      // Call callback FN
      if (callback) callback(connection.db);
    })
    .catch(function (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });

};

module.exports.disconnect = function (cb) {
  mongoose.connection.close(function (err) {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};
