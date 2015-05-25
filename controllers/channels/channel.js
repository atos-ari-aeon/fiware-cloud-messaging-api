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
 * Controler for channels
 *
 */


var backend = require('../../core/backend/mongomodels/channeldb');
var errorsManagement = require('../errors.js');
var responsesManagment = require('../responses.js');
var entities = require('../entities/entity.js');
var config = require('../../config/config.js');
var manager = require('../../core/middleware/manager');
var logger = require('../../logger.js');
var AEONChannel = require('broker-manager').Channel;

function checkChannelModel(channelModel) {
  if (!("type" in channelModel) || (channelModel.type != "channel")) {
    console.log("not model of type channel");
    return false;
  }

  if (!("channelname" in channelModel) || !("channeldesc" in channelModel)) {
    console.log("not channelname or channeldesc");
    return false;
  }

  return true;
}

function checkSubscriptionParams(subscription) {
  if (!("id" in subscription) || !("desc" in subscription)) {
    console.log("incorrect subscription request");
    return false;
  }

  return true;
}

function channelsResponse(err, doc, res) {
  responsesManagment.sendResponse(err, res, doc);
}

function addChannelPubSub(doc, req, res) {
  // if (addChannelId === true)
  //     channel_id = doc._id;
  // else
  //     channel_id = "";

  var pubID = doc.pubID;
  var subID = doc.subID;
  var entityUrl = "";

  if (config.app.extPort != 80) {
    // entityUrl = config.app.protocol + "://" + config.app.extHost + ":" + config.app.extPort + req.url + channel_id;
    entityUrl = config.app.protocol + "://" + config.app.extHost + ":" + config.app.extPort;
  } else {
    // entityUrl = config.app.protocol + "://" + config.app.extHost + req.url + channel_id;
    entityUrl = config.app.protocol + "://" + config.app.extHost;
  }

  doc.puburl = entityUrl + "/publish/" + pubID;
  doc.subscriptionsurl = entityUrl + "/subscribe/" + subID;

  delete doc.broker;

  channelsResponse(null, doc, res);
}


exports.remove = function (req, res) {
  //Remove the channel from the database and the rabbitMQ
  manager.deleteChannel(req.brokerConnection, req.dbConnection, req.params.entity, req.params.channel, function (err, doc) {
    channelsResponse(err, doc, res);
  });
};

exports.list = function (req, res) {
  console.log("List of channels");

  entities.isEntityOwner(req, function (checked, err) {
    if (!checked) {
      errorsManagement.sendError(err, res);
    } else {
      var projection = {
        'channels.broker': 0,
        'channels.subscriptions': 0
      };

      manager.findAllChannels(req.dbConnection, req.params.entity, projection, function (error, doc) {
        channelsResponse(err, doc, res);
      });

    }
  });
};


exports.info = function (req, res) {
  console.log("Info for channel ", req.params.channel);

  entities.isEntityOwner(req, function (checked, error) {
    if (!checked) {
      errorsManagement.sendError(error, res);
    } else {
      manager.getChannelInfo(req.params.entity, req.params.channel, req.dbConnection, function (error, doc) {
        if (error) {
          errorsManagement.sendError(errorsManagement.CHANNEL_NOT_EXISTS, res);
        } else {
          addChannelPubSub(doc, req, res);
        }
      });
    }
  });

};

exports.create = function (req, res) {
  var channelModel;

  function checkChannelCreated(err, doc) {
    if (err) {
      errorsManagement.sendError(errorsManagement.CHANNEL_ERROR, res);
    } else {
      addChannelPubSub(doc, req, res);
    }

  }

  function checkedEntityOwner(checked, err) {
    if (!checked) {
      errorsManagement.sendError(err, res);
    } else {
      manager.createChannel(req.brokerConnection, req.dbConnection, req.params.entity, channelModel, checkChannelCreated);
    }
  }

  logger.info("createChannel()");

  channelModel = req.body;

  if (channelModel.channelname == "" || channelModel.channelname == undefined) {
    errorsManagement.sendError(errorsManagement.WRONG_CHANNEL_ID,  res);
  }

  if (checkChannelModel(channelModel)) {
    logger.info("Create channel into broker");
    entities.isEntityOwner(req, checkedEntityOwner);
  } else {
    errorsManagement.sendError(errorsManagement.INCORRECT_MODEL_ERROR, 400, res);
  }

};

exports.update = function (req, res) {
  var entityID = req.params.entity;
  var channelID = req.params.channel;
  var channelModel = req.body;

  if (checkChannelModel(channelModel)) {
    logger.info("Update channel");

    manager.updateChannel(entityID, channelID, req.body, req.dbConnection, function (err, doc) {
      if (err) {
        errorsManagement.sendError(errorsManagement.CHANNEL_ERROR, res);
      } else {
        channelsResponse(err, doc, res);
      }

    });
  } else {
    errorsManagement.sendError(errorsManagement.INCORRECT_MODEL_ERROR, res);
  }

};

/*
 * Preconditions:
 * This function is considered as a worker in the publish chain
 * Perms and checks have been done previously
 * So, this worker works in autonomous way expecting
 * AEONChannel param into the request if everything is ready
 * to publish the messagePublish
 *
 */
exports.publish = function (req, res, next) {

  logger.info("publish()");
  var doc = null;

  if ("AEONChannel" in req) {
    doc = req.AEONChannel;

    var channel = new AEONChannel(doc.channelname);

    channel.setChannelDesc(doc.channeldesc);
    channel.setPubKey(doc.broker.pubkey);
    channel.setPubID(doc.pubID);
    channel.setSubID(doc.subID);

    manager.publish(req.brokerConnection, channel, req.body, function (err, doc) {
      channelsResponse(err, req.body, res);
      next(); //Invoke the next worker of the chain
    });
  } else {
    errorsManagement.sendError(errorsManagement.UNKNOWN_ERROR, res);
  }

};



/*
 * Preconditions:
 * This function is considered as a worker in the subscription chain
 * Perms and checks have been done previously
 * So, this worker works in autonomous way expecting
 * AEONChannel param into the request, a new queu is created in the
 * broker and the information is attached to the channel document
 *
 */
exports.getSubscription = function (req, res, next) {
  logger.info("getSubscription()");

  if (checkSubscriptionParams(req.query)) {
    if ("AEONChannel" in req) {
      var doc = req.AEONChannel;
      var channel = new AEONChannel(doc.channelname);

      channel.setChannelDesc(doc.channeldesc);
      channel.setPubKey(doc.broker.pubkey);
      channel.setPubID(doc.pubID);
      channel.setSubID(doc.subID);

      console.log("creating subscription for channel " + channel.getChannelName() + " and subID " + channel.getSubID());

      var id = req.query["id"];
      var desc = req.query["desc"];
      var ip = req.headers['host'];

      subscription = {
        "id": id,
        "desc": desc,
        "ip": ip
      };

      manager.createQueue(req.brokerConnection, req.dbConnection, req.entityID, req.channelID, channel, subscription, function (error, doc) {
        channelsResponse(error, doc, res);
        next(); //Invoke the next worker of the chain
      });

    } else {
      errorsManagement.sendError(errorsManagement.UNKNOWN_ERROR, res);
    }
  } else {
    errorsManagement.sendError(errorsManagement.INCORRECT_MODEL_ERROR, res);
  }

};

