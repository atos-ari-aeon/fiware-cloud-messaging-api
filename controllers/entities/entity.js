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
 * Controler for entities
 *
 */


var errorsManagment = require('../errors.js');
var responsesManagment = require('../responses.js');
var manager = require('../../core/middleware/manager');

function checkEntityModel(entityModel) {
  if (!("type" in entityModel) || (entityModel.type !== "entity")) {
//    logger.error("not model of type entity");
    return false;
  }

  if (!("entityname" in entityModel) || !("entitydescription" in entityModel)) {
  //  logger.error("not entityname or entitydescription");
    return false;
  }

  return true;
}

function entitiesResponse(err, doc, res) {
  responsesManagment.sendResponse(err, res, doc);
}


/*
 * Generic functions
 *
 */


/*
 * Check if the requester user is the owner of their
 * entity
 *
 */
exports.isEntityOwner = function (req, next) {
  var projection = {};

  manager.getEntityByID(req.params.entity, projection, req.dbConnection, function (err, docs) {
    if (err) {
      next(false, err);
    } else {
      if (docs.length !== 1) {
        next(false, errorsManagment.UNKNOWN_ERROR);
      } else {
        if (docs[0].owner !== req.user._id) {
          next(false, errorsManagment.NOT_AUTHORIZED);
        } else {
          next(true);
        }

      }

    }

  });
};

/*
 * CRUD functions for REST interface
 *
 */
exports.remove = function (req, res) {
  //logger.info("Delete entity ", req.params.entity);

  manager.deleteEntity(req.brokerConnection, req.dbConnection, req.params.entity, function (err, doc) {
    entitiesResponse(err, doc, res);
  });
};

exports.list = function (req, res) {
  //console.log("List of entities");
  var projection = { 'channels': 0};

  manager.getEntities(req.user._id, projection, req.dbConnection, function (err, doc) {
    entitiesResponse(err, doc, res);
  });

};

exports.info = function (req, res) {
  //console.log("Info for entity ", req.params.entity);
  exports.isEntityOwner(req, function (checked, err) {
    if (!checked) {
      errorsManagment.sendError(err, res);
    } else {
      var projection = { 'channels.broker': 0, 'channels.subscriptions': 0 };

      manager.getEntity(req.params.entity, projection, req.dbConnection, function (err, doc) {
        entitiesResponse(err, doc, res);
      });
    }

  });
};


exports.create = function (req, res) {
  //console.log("Create entity");
  // lets try to do very light checks

  var entityModel = req.body;

  if (checkEntityModel(entityModel)) {
    entityModel.owner = req.user._id;

    if (entityModel.entityname === "" || entityModel.entityname === undefined) {
      errorsManagment.sendError(errorsManagment.WRONG_ENTITY_ID,  res);
    }

    manager.createEntity(entityModel, req.dbConnection, function (err, doc) {
      entitiesResponse(err, doc, res);
    });

  } else {
    errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);

  }

};

exports.update = function (req, res) {
  //console.log("Update entity");

  var entityID = req.params.entity;
  var entityModel = req.body;

  if (checkEntityModel(entityModel)) {
    entityModel.owner = req.user._id;
    manager.updateEntity(entityID, entityModel, req.dbConnection, function (err, doc) {
      entitiesResponse(err, doc, res);
    });

  } else {
    errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);

  }

};

