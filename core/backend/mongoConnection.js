/**
    Copyright (C) 2014 ATOS
 
    This file is part of AEON.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
   
   
   Authors: Jose Gato Luis (jose.gato@atos.net)
            Javier Garcia Hernandez (javier.garcia@atos.net)

*/

/*
 * Class to control DDBB Connection
 * In this case against mongo.db DB
 *
 */

var mongodb = require('mongodb');

options = {};
options.safe = true;
options.logger = {};
options.logger.doDebug = true;
options.logger.debug = function (message, object) {
  // print the mongo command:
  // "writing command to mongodb"
  console.log(message);

  // print the collection name
  console.log(object.json.collectionName);

  // print the json query sent to MongoDB
  console.log(object.json.query);

  // print the binary object
  console.log(object.binary);
};


// Constructor

function MongoConnection(config) {
  this.dbClient = null;
  this.config = config;
  this.options = options;

}

MongoConnection.prototype.getClient = function getClient() {
  return this.dbClient;
};


MongoConnection.prototype.setClient = function setClient(client) {
  this.dbClient = client;
};


/*
 * Recommendation, create one connection and share the client
 * which contains a pool to manage accesses
 *
 */

MongoConnection.prototype.createConnection = function createConnection() {
  var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
  var mongoClient = new MongoClient(new Server(this.config.host, this.config.port), options);
  var obj = this;

  mongoClient.open(function (err, mongoClient) {
    if (err) {
      console.log(err);
      throw err;
    }

    var dbAEON = mongoClient.db(obj.config.db);
    if (obj.config.username != "") {
      dbAEON.authenticate(obj.config.username, obj.config.password, function (err, result) {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log("AEON DB connected");
        obj.setClient(dbAEON);
      });
    } else {
      obj.setClient(dbAEON);
    }
  });

};

module.exports = MongoConnection;

//exports.dbConnection = new mongodb.Db(dbConfig.dbName, server, options);

/*
 * Recommendation, create one connection and share the client
 * which contains a pool to manage accesses
 *
 */

// exports.createConnection = function () {
//    
//    var MongoClient = require('mongodb').MongoClient,
//        Server = require('mongodb').Server;
// 
//    var mongoClient = new MongoClient(new Server(dbConfig.host, dbConfig.port), options);
//        
// //  old style
// //    var server = new mongodb.Server(dbConfig.host, dbConfig.port, {});
// //    var dbAEON = new mongodb.Db(dbConfig.dbName, server, options);
// 
//    mongoClient.open(function(err, mongoClient) {
//  
//        if (err) {
//            console.log(err);
//            throw err;
//        }
//        
//        var dbAEON = mongoClient.db(dbConfig.dbName);
//        console.log("AEON DB connected");
//        this.dbClient = dbAEON;
//    });
// 
// };

