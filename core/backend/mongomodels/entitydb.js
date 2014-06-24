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
 * Mongo manager for entity's models
 *
 */

var errorsManagement = require('../../../controllers/errors.js');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../../logger.js');

module.exports.findEntityByID = function findEntityByID (entityID, projection, dbConnection, next){
    logger.info("findEntityByID(): finding entity " + entityID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    var objectID = new ObjectID(entityID);

    collection.find( {"_id" : objectID }, projection).toArray(function(err, docs){
        if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
        };
        if (docs.length == 0)
            next (errorsManagement.ENTITY_NOT_EXISTS, null);
        else{
            next(null, docs);
        }
    });


}



module.exports.removeByEntityID = function removeByEntityID (entityID, dbConnection, next){
    logger.info("removeByEntityID(): deleting entity " + entityID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);
    var objectID = new ObjectID(entityID);
    
    collection.remove({"_id" : objectID }, function(err, docs) {
        if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
            return;
        } 
        
        if (docs == 0)
            next (errorsManagement.ENTITY_NOT_EXISTS, null);
        else {
            next(null, docs);
        }
    });


}

module.exports.findAll = function findAll (dbConnection, next){
    logger.info("findAll(): finding entities ");
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    collection.find().toArray(function(err, docs){
        if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
        };
        next(null, docs);
    });


}

module.exports.findAllByOwner = function findAllByOwner (ownerID, projection, dbConnection, next){
    logger.info("findAllByOwner():finding entities ");
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    collection.find({"owner": ownerID}, projection).toArray(function(err, docs){
        if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
        };
        next(null, docs);
    });


}
    
module.exports.createEntity = function createEntity(entity, dbConnection, next) {
    logger.info("createEntity(): creating entity " + entity);
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    collection.insert(entity, function(err, docs) {
        if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
            return;
        } 
        next(null, docs);
    });
};

module.exports.updateEntity = function updateEntity (entityID, entity, dbConnection, next){

    var entityID = new ObjectID(entityID);    

    logger.info("updateEntity(): updating entity "+entity);
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);    

     collection.update({_id:entityID}, {
        $set:{
            entityname:entity.entityname,
            entitydescription:entity.entitydescription
        }        
     }, function(err, docs){
         if (err) {
            next(errorsManagment.UNKNOWN_ERROR, null);
            return;
        } 
        next(null, docs);
    });       

};
