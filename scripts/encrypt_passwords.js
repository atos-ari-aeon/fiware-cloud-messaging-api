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
var config = require('../config/config.js');
var logger = require('../logger.js');
var MongoConnection = require('../core/backend/mongoConnection');
var usersBackend = require('../core/backend/mongomodels/userdb');



var updatePasswords = function updatePasswords(connection){

    cn = {};
    cn.getClient = function(){
        return connection;
    }
    cn.config = config.db;

    usersBackend.findAll(cn, null, function(error, docs){
        if (error)
            return logger.error(error);
        docs.forEach(function(item){
	    //logger.info(item.password);
            usersBackend.updateUserPassword(item._id, item.password, cn, function(error, doc){
                if (error)
                    return logger.error(error);
                logger.info("updated password for " + item._id);
            })
        });

    });
}



options = {}
options.safe = true;
options.logger = {};
options.logger.doDebug = true;
options.logger.debug = function(message, object) {
    // print the mongo command:
    // "writing command to mongodb"
    console.log(message);

    // print the collection name
    console.log(object.json.collectionName)

    // print the json query sent to MongoDB
    console.log(object.json.query)

    // print the binary object
    console.log(object.binary)
}


// we connection will be ready you will access by dbConnection.getClient()
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server(config.db.host, config.db.port), options);


mongoClient.open(function(err, mongoClient) {

    if (err) 
        return logger.error(err);

    var dbAEON = mongoClient.db(config.db.db);
    if (config.db.username != "") {
        logger.info("authenticating");
        dbAEON.authenticate(config.db.username, config.db.password, function(err, result) {
            if (err) 
                return logger.error(err);

            logger.info("AEON DB connected");
            updatePasswords(dbAEON);
        });
    } else {
        logger.info("AEON DB connected");
        updatePasswords(dbAEON);

    }
});



