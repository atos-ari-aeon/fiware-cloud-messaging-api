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
 * Mongo manager for channels's models
 *
 */


var errorsManagement = require('../../../controllers/errors');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../../logger');

module.exports.findChannelByID = function findChannel(entityID, channelID, dbConnection, next) {


    //logger.info("finding channel " + channelID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    try{
        entityID = new ObjectID(entityID);    
    }
    catch(err){
      logger.error("channeldb findChannelByID() WRONG_ENTITY_ID: " + entityID);
      next(errorsManagement.WRONG_ENTITY_ID,{});
    }
    
    try{
        channelID = new ObjectID(channelID);
    }
    catch(err){
      logger.error("channeldb findChannelByID() WRONG_CHANNEL_ID: " + channelID);
      next(errorsManagement.WRONG_CHANNEL_ID,{});
    }

    var query = {
        "_id": entityID
    };
    var projection = {
        _id: 0,
        channels: {
            $elemMatch: {
                "_id": channelID
            }
        }
    };

    collection.findOne(query, projection, function(err, doc) {

        if (err) {
          logger.error("channeldb findChannelByID() UNKNOWN_ERROR: " + channelID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        } else if (doc.channels == null) {
          logger.error("channeldb findChannelByID() CHANNEL_NOT_EXISTS: " + channelID);
          next(errorsManagement.CHANNEL_NOT_EXISTS, {});
        } else if (doc.channels.length == 1){
          next(null, doc.channels[0]);
        } else {
          logger.error("channeldb findChannelByID() REPLICATED_CHANNEL: " + channelID);
          next(errorsManagement.REPLICATED_CHANNEL, {});
        }
    });


}

module.exports.findChannelByPubID = function findChannelByPubId(pubID, dbConnection, next) {


    //logger.info("finding channel by pubID " + pubID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    var query = {
        "channels.pubID": pubID
    };
    var projection = {
        _id: 1,
        channels: {
            $elemMatch: {
                "pubID": pubID
            }
        }
    };

    collection.findOne(query, projection, function(err, doc) {

        if (err) {
          logger.error("channeldb findChannelByPubID() UNKNOWN_ERROR: " + pubID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        } else if (doc == null || doc.channels == null) {
          logger.error("channeldb findChannelByPubID() PUB_URL_NOT_EXISTS pubId: " + pubID);
          next(errorsManagement.PUB_URL_NOT_EXISTS, null);
        } else if (doc.channels.length == 1) {
          next(null, doc);
        } else {
          logger.error("channeldb findChannelByPubID() REPLICATED_CHANNEL pubId: " + pubID);
          next(errorsManagement.REPLICATED_CHANNEL, null);
        }
        
    });
}

module.exports.findChannelBySubID = function findChannelBySubId(subID, dbConnection, next) {


    //logger.info("finding channel by subID " + subID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    var query = {
        'channels.subID': subID
    };
    var projection = {
        _id: 1,
        channels: {
            $elemMatch: {
                "subID": subID
            }
        }
    };

    collection.findOne(query, projection, function(err, doc) {
        
        if (err) {
          logger.error("channeldb findChannelBySubID() UNKNOWN_ERROR: " + subID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        } else if (doc == null || doc.channels == null) {
            logger.error("channeldb findChannelBySubID() SUB_URL_NOT_EXISTS sudId: " + subID);
            next(errorsManagement.SUB_URL_NOT_EXISTS, {});
        } else if (doc.channels.length == 1) {
            next(null, doc);
        } else {
            logger.error("channeldb findChannelBySubID() REPLICATED_CHANNEL subId: " + subID);
            next(errorsManagement.REPLICATED_CHANNEL, {});
        }
        
    });
}

module.exports.findSubscriptionBySubID = function findSubscriptionBySubID(subID, subscription, dbConnection, next) {


    //logger.info("finding subscription by subID " + subID);
    
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    // var query = {
    //     'channels.subID': subID,
    //     'channels.subscriptions':{
    //         $elemMatch:{
    //             id: subscription.id,
    //             desc: subscription.desc
    //         }
    //     }
    // };
    
    collection.aggregate([
        {   
            $match: {'channels.subID':subID}
        },
        {
            $unwind: '$channels'
        },
        {
            $unwind: '$channels.subscriptions'
        },
        {
           $match:{
                'channels.subscriptions.id': subscription.id,
                'channels.subscriptions.desc': subscription.desc
            }
        },
        {
            $project:{
                _id:0,
                subscriptions: '$channels.subscriptions'
            }
        }
    ],function(error, docs){

        if(error){
          logger.error("channeldb findSubscriptionBySubID() UNKNOWN_ERROR: " + subID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        }
        else{
            
            if(docs.length!=0)
              next(null, docs[0].subscriptions);
            else {
              logger.error("channeldb findSubscriptionBySubID() SUBSCRIPTION_NOT_EXIST: " + subID);
              next(errorsManagement.SUBSCRIPTION_NOT_EXIST, null);
            }
        }
    });


}

module.exports.removeByChannelID = function removeByChannelID(entityID, channelID, dbConnection, next) {
    //logger.info("removeByChannelID(): deleting channel " + channelID);

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);
    var entityID = new ObjectID(entityID);
    var channelID = new ObjectID(channelID);

    var query = {
        "_id": entityID
    };
    var update = {
        $pull: {
            channels: {
                "_id": channelID
            }
        }
    };


    collection.update(query, update, function(error, docs) {
        if (error) {
          logger.error("channeldb removeByChannelID() UNKNOWN_ERROR " + channelID);
          next(errorsManagement.UNKNOWN_ERROR, null);
          return;
        }

        if (docs == 0){
          logger.error("channeldb removeByChannelID(): " + channelID+ " ENTITY_NOT_EXISTS: " + entityID);
          next(errorsManagement.ENTITY_NOT_EXISTS, null);
        } else {
            next(null, docs);
        }
    });


}

module.exports.findAll = function findAll(entityID, projection, dbConnection, next) {
    //logger.info("findAll(): finding channels ");

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    /*
     * Channels are a subpart of entities,
     * So, you search for all the channels
     * of an specific entity
     *
     */

    var objectID = new ObjectID(entityID);

    collection.findOne({
        "_id": objectID
    }, projection, function(error, doc) {
        if (error) {
          logger.error("channeldb findAll() UNKNOWN_ERROR entity: " + entityID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        };

        if (doc.channels)
            next(null, doc.channels);
        else
            next(null, []);
    });


}

module.exports.createChannel = function createChannel(entityID, channel, dbConnection, next) {
    //logger.info("createChannel(): creating channel " + entity + " for the entity " + entityID);
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    var objectID = new ObjectID(entityID);
    channel._id = new ObjectID();

    delete channel.broker.subkey;

    collection.update({
        "_id": objectID
    }, {
        $push: {
            "channels": channel
        }
    }, function(error, docs) {
        if (error) {
          logger.error("channeldb createChannel() UNKNOWN_ERROR entity: " + entityID);
          next(errorsManagement.UNKNOWN_ERROR, null);
          return;
        }
        
        next(null, channel);
    });



};

module.exports.updateChannel = function updateChannel(entityID, channelID, channel, dbConnection, next){
    //logger.info("updateChannel(): updating channel " + channelID + " for the entity " + entityID);

    channelID = new ObjectID(channelID);
    entityID = new ObjectID(entityID);

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    collection.update({_id:entityID, "channels._id":channelID}, {
        $set:{
            'channels.$.channelname':channel.channelname,
            'channels.$.channeldesc':channel.channeldesc
        }
    },function(error,doc){
        if (error) {
          logger.error("channeldb updateChannel() UNKNOWN_ERROR: " + channelID + " entity: " + entityID);
          next(errorsManagement.UNKNOWN_ERROR, null);
        }
        else{
            next(null, doc);
        }
    });

}

// module.exports.addChannelSubscription = function addChannelSubscription(entityID, channelID, subscription, dbConnection, next) {
module.exports.addChannelSubscription = function addChannelSubscription(entityID, channelID, subscription, dbConnection, next) {
    //logger.info("addChannelSubscription(): Adding susbscription to channel  " + channelID + " for the entity " + entityID);
    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    subscription._id = new ObjectID();
    
    collection.update({
        "_id": entityID,
        "channels._id": channelID
    }, {
        $push: {
            "channels.$.subscriptions": subscription
        }
    }, function(error, docs) {
        if (error) {
          logger.error("channeldb addChannelSubscription() UNKNOWN_ERROR: " + channelID + " entity: " + entityID);
            next(errorsManagement.UNKNOWN_ERROR, null);
            return;
        }
        next(null, docs);
    });


};

module.exports.getChannelQueues = function getChannelQueues(entityID, channelID, dbConnection, next){

    //logger.info("getChannelQueues(): Getting queues for channel "+ channelID + " for the entity "+entityID);

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    objectID = new ObjectID(entityID);
    channelID = new ObjectID(channelID);

    collection.aggregate([
        {
            $match:
                {
                    _id:objectID
                }
        },
        {
            $unwind:"$channels"
        },
        {
            $match:
                {
                    "channels._id":channelID
                }
        },
        {
            $unwind:"$channels.subscriptions"
        },
        {
            $project:
                {
                    queueName:"$channels.subscriptions.subkey"
                }
        }
    ], function(error, docs){
        if(error){
          logger.error("channeldb getChannelQueues() UNKNOWN_ERROR: "+ channelID + " entity "+entityID);
            next(errorsManagement.UNKNOWN_ERROR, null);
            return;
        }
        else{            
            next(null, docs);
        }
            
    });

}

module.exports.getChannelSubscription = function getChannelSubscription(subID, subscription, dbConnection, next){

    //logger.info("Get Subscription id: "+ subscription.id+" desc: "+subscription.desc);

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    collection.aggregate([
        {
          $unwind:'$channels'
        },
        {
            $match:{
                'channels.subID': subID
            }
        },
        {
            $unwind:'$channels.subscriptions'
        },
        {
            $match:{
                'channels.subscriptions.id': subscription.id,
              'channels.subscriptions.desc': subscription.desc
            }
        }/*,
        {
            $match:{
                'channels.subscriptions':{
                    $elemMatch:{
                        id: subscription.id,
                        desc: subscription.desc
                    }
                }
            }   
        }*/
    ], function(error, docs){        
        if(error){          
          logger.error("channeldb getChannelSubscription() UNKNOWN_ERROR id: "+ subscription.id);
          next(errorsManagement.UNKNOWN_ERROR, null);
        }
        else{                      
            next(null, docs);
        }
    });

}



module.exports.deleteChannelSubscription = function deleteChannelSubscription(subID, subscription, dbConnection, next){

    //logger.info("Delete Subscription "+ subID + " id: "+ subscription.id+" desc: "+subscription.desc);

    collection = dbConnection.getClient().collection(dbConnection.config.collectionEntities);

    var query = {'channels.subID': subID};
    var projection = {
                        $pull:{
                            'channels.$.subscriptions':{
                                id:subscription.id,
                                desc:subscription.desc
                            }
                        }
                    };

    collection.update(query, projection, function(error, docs){

        if(error){
          logger.error("channeldb deleteChannelSubscription: "+ subID + " id: "+ subscription.id);
          next(errorsManagement.UNKNOWN_ERROR, null);
        }
        else{            
            next(null, docs);
        }
    });

}
