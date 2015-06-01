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
 * Controler for subscriptions
 *
 */

var backend = require('../../core/backend/mongomodels/channeldb');
var errorsManagment = require('../errors.js');
var responsesManagment = require('../responses.js');
var entities = require('../entities/entity.js');
var config = require('../../config/config.js');
var manager = require('../../core/middleware/manager');
var logger = require('../../logger.js');
var AEONChannel = require('broker-manager').Channel;
var subscriptionModel = require('./models/subscriptionmodel');

function checkSubscriptionParams(subscription) {

  if (!("id" in subscription) || !("desc" in subscription)) {
    logger.error("incorrect subscription request");
    return false;
  }

  //console.log("correct request");
  return true;
}

exports.remove = function remove(req, res){

    var subscription = req.body;
    var subID = req.params.subID;

    if(checkSubscriptionParams(subscription)==true){

        manager.removeSubscription(req.brokerConnection, req.dbConnection, subID, subscription, function(err, doc) {

            responsesManagment.sendResponse(err, res, doc);

        });
    }
    else
        errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);

}

exports.getConfig = function getConfig(req, res){

    var result = {};
    result.socket_server = config.app.protocol + "://" + config.app.socket_server_host + ":" + config.app.socket_server_port;



    responsesManagment.sendResponse(null, res, result);

}
