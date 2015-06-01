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
    Middleware layer to manage the requests and connections with the backend 
*/

var BrokerManager = require('broker-manager').BrokerManager;
var channelsBackend = require('../backend/mongomodels/channeldb');
var entitiesBackend = require('../backend/mongomodels/entitydb');
var usersBackend = require('../backend/mongomodels/userdb');
// var publisher = require('../core/broker/publisher.js');
var AEONChannel = require('broker-manager').Channel;
var logger = require('../../logger.js');
var errorsManagement = require('../../controllers/errors.js');


/*****************/
/* SUBSCRIPTIONS */
/*****************/

/*
 This method will delete a subscription from a specific channel 
*/
exports.removeSubscription = function removeSubscription(broker, dbConnection, subID, subscription, next) {
  var brokerManager = new BrokerManager(broker);
  var tmpChannel = new AEONChannel();

  //Get the channel associated to the subscription
  channelsBackend.findSubscriptionBySubID(subID, subscription, dbConnection, function (err, doc) {

    if (err) {
      next(err, null);
    } else {
      var tmpSubscription = doc;

      tmpChannel.setSubKey(tmpSubscription.subkey);

      //Borrar cola de la suscripcion
      brokerManager.deleteQueue(tmpChannel, true, function (error) {
        if (error) {
          logger.error("Manager deleteQueue() error ", error, " with code ", error.code);
          next(error, null);
        } else {
          //Delete subscription from DB
          channelsBackend.deleteChannelSubscription(subID, subscription, dbConnection, function (err, doc) {
            if (err) {
              //errorsManagement.sendError(err.message, 404, res);
              next(err, null);
            } else {
              next(null, doc);
            }
            
          });

        }
      });
    }
  });

};

/************/
/* CHANNELS */
/************/

/*
 This method will find all the channels belonging to an entity
*/
exports.findAllChannels = function findAllChannels(dbConnection, entityID, projection, next) {
  channelsBackend.findAll(entityID, projection, dbConnection, function (err, docs) {
    if (err) {
      next(err, null);
    } else {
      next(err, docs);
    }
  });
};

/*
* This method will create a channel in the database and in the rabbitMQ
*/
exports.createChannel = function createChannel(broker, dbConnection, entityID, channel, next) {
  function brokerChannel(err, channel) {
    if (err) {
      next(err, null);
    }

    channel.subscriptions = [];
    channelsBackend.createChannel(entityID, channel, dbConnection, function (err, doc) {
      logger.info("Channel created correctly: ", doc);
      next(err, doc);
    });
  }

  var brokerManager = new BrokerManager(broker);
  var aeonChannel = new AEONChannel(channel.channelname);

  aeonChannel.setChannelDesc(channel.channeldesc);
  brokerManager.createChannel(aeonChannel, function (error, result) {
    if (error) {
      logger.error("Manager createChannel() error ", error, " with code ", error.code);
      next(error, null);
    } else {
      brokerChannel(error, result);
    }

  });
};

/*
* This method will delete a channel from the database and from the rabbitMQ
*/
exports.deleteChannel = function deleteChannel(broker, dbConnection, entityID, channel, next) {

     /*
     * Not so trivial: it needs to remove channels
     * from broker and DDBB
     * Supported in future versions
     */

  var brokerManager = new BrokerManager(broker);

  channelsBackend.findChannelByID(entityID, channel, dbConnection, function (error, doc) {
    if (error) {
      logger.error("No channel found in deleteChannel() error ", error, " with code ", error.code);
      next(error, null);
    } else {
      var channelInfo = new AEONChannel(doc.channelname);

      channelInfo.setChannelDesc(doc.channeldesc);
      channelInfo.setPubKey(doc.broker.pubkey);
      channelInfo.setSubKey(doc.broker.subkey);

      //Get all the queues for this channel
      channelsBackend.getChannelQueues(entityID, channel, dbConnection, function (error, docs) {
        if (error) {
          logger.error("Manager getChannelQueues() mongodb error ", error, " with code ", error.code);
          next(error, null);
        } else {
          var channelQueues = docs;

          //First, remove the channel from the database (with all the subscriptions)
          channelsBackend.removeByChannelID(entityID, channel, dbConnection, function (error, doc) {
            if (error) {
              logger.error("Manager deleteChannel() mongodb error ", error, " with code ", error.code);
              next(error, null);
            } else {
              //Now, remove all the queues from the rabbitMQ server
              var i;
              for (i = 0; i < channelQueues.length; i++) {
                var tmpChannel = new AEONChannel();
                tmpChannel.setSubKey(channelQueues[i].queueName);
                brokerManager.deleteQueue(tmpChannel, true, function (error) {
                  if (error) {
                    logger.error("Manager deleteQueue() error ", error, " with code ", error.code);
                    next(error, null);
                  }

                });
              }

              brokerManager.deleteChannel(channelInfo, function (error, result) {
                if (error) {
                  logger.error("Manager deleteChannel() rabbitMQ error ", error, " with code ", error.code);
                  next(error, null);
                } else {
                  next(error, result);
                }

              });
            }
          });
        }
      });
    }
  });
};

/*
* This method will update a channel in the database. It will only update the basic info
*/
exports.updateChannel = function updateChannel(entityID, channelID, channel, dbConnection, next) {

  channelsBackend.updateChannel(entityID, channelID, channel, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }
  });
};

/*
* This method will retrieve the selected channel info
*/
exports.getChannelInfo = function getChannel(entityID, channelID, dbConnection, next) {

  channelsBackend.findChannelByID(entityID, channelID, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }
  });
};

/*
* This method will publish a message over a specific channel
*/
exports.publish = function publish(broker, channel, message, next) {
  var brokerManager = new BrokerManager(broker);

  brokerManager.publish(channel, message, function (error, doc) {
    if (error) {
      logger.error("Manager publish() error ", error, " with code ", error.code);
      next(error, null);
    } else {
      next(doc, error);
    }
  });
};

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.createQueue = function createQueue(broker, dbConnection, entityID, channelID, channel, subscription, next) {

  var brokerManager = new BrokerManager(broker);

  function addSubscription(err, resultchannel) {
    subscription.subkey = resultchannel.broker.subkey;
    channelsBackend.addChannelSubscription(entityID, channelID, subscription, dbConnection,
      function (err, doc) {
        if (err) {
          logger.error("Error storing data about the new subscription");
          logger.error("Deleting the queue from the broker (beta)");
          brokerManager.deleteQueue(resultChannel, subscription.subkey, function (err, doc) {
            if (err) {
              next(err, null);
            } else {
              errorsManagement.sendError(errorsManagement.CHANNEL_ADD_SUBSCRIPTION, res);
            }
          });
        } else {
          brokerManager.closeQueue(resultchannel, function (err, result) {
            if (err) {
              logger.error("Manager closeQueue() error ", err, " with code ", err.code);
              next(err, null);
            } else {
              next(err, subscription);
            }
          });
        }

      });
  }

  //Check if the subscription already exists
  channelsBackend.getChannelSubscription(channel.getSubID(), subscription, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    }

    if (doc != undefined) {
      if (doc.length != 0) {
        var subscriptions = doc[0].channels.subscriptions;
        for (i = 0; i < subscriptions.length; i++) {
          if (subscriptions[i].id == subscription.id && subscriptions[i].desc == subscription.desc) {
            next(err, subscriptions[i]);
          }

        }

          //next(errorsManagement.SUBSCRIPTION_ALREADY_EXISTS, null);
      } else {
        console.log("correct request");
        brokerManager.createQueue(channel, function (error, result) {
          if (error) {
            logger.error("Manager createQueue() error ", error, " with code ", error.code);
            next(error, null);
          } else {
            addSubscription(error, result);
          }

        });
      }

    }
  });
};

/************/
/* ENTITIES */
/************/

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.getEntities = function getEntities(userID, projection, dbConnection, next) {
  entitiesBackend.findAllByOwner(userID, projection, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }

  });
};

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.getEntity = function getEntity(entityID, projection, dbConnection, next) {
  entitiesBackend.findEntityByID(entityID, projection, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }

  });
};

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.createEntity = function createEntity(entityModel, dbConnection, next) {
  entitiesBackend.createEntity(entityModel, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }
  });
};

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.updateEntity = function updateEntity(entityID, entityModel, dbConnection, next) {
  entitiesBackend.updateEntity(entityID, entityModel, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }
  });
};

/*
* This method will subscribe to a channel to retrive the information over it
*/
exports.getEntityByID = function updateEntity(entityID, projection, dbConnection, next) {
  entitiesBackend.findEntityByID(entityID, projection, dbConnection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }

  });
};

/*
* This method will delete an entity with its channels
*/
exports.deleteEntity = function deleteEntity(broker, dbConnection, entityID, next) {
  var brokerManager = new BrokerManager(broker);

  if (entityID != undefined && entityID != null) {

       //Here we have to remove the channels associated to this entity and the exchanges from the rabbitMQ too.
    channelsBackend.findAll(entityID, {}, dbConnection, function (err, doc) {
      if (err) {
        next(err, null);
      } else {
        var channels = doc;

        //If the entity has channels, we delete them
        if (channels.length > 0) {
          var deletedChannels = 0;

          for (i = 0; i < channels.length; i++) {
            var channelID = channels[i]._id;
            channelID = channelID.toString();

            exports.deleteChannel(broker, dbConnection, entityID, channelID, function (error, result) {
              if (error) {
                next(error, null);
              } else {
                deletedChannels += 1;

                if (deletedChannels == channels.length) {
                  entitiesBackend.removeByEntityID(entityID, dbConnection, function (err, doc) {
                    if (err) {
                      next(err, null);
                    } else {
                      next(err, doc);
                    }
                  });
                }
              }
            });

          }
        } else { //If the entity has no channel, we delete just the entity
          entitiesBackend.removeByEntityID(entityID, dbConnection, function (err, doc) {
            if (err) {
              next(err, null);
            } else {
              next(err, doc);
            }
            
          });
        }
      }
    });
  } else {
    next(errorsManagement.entityNotExists, null);
  }

};

/*********/
/* USERS */
/*********/

/*
* This method will retrieve the list of users
*/
exports.getUsers = function getUsers(dbConnection, projection, next) {
  usersBackend.findAll(dbConnection, projection, function (err, doc) {
    if (err) {
      next(err, null);
    } else {
      next(err, doc);
    }
  });
};

/*
* This method will find a user by name
*/
exports.getUserByName = function getUserByName(userID, dbConnection, projection ,next){
  usersBackend.findUserByName(userID, dbConnection, projection, function (err, doc) {
    if(err)
      next(err, null);
    else{
      next(err, doc);
    }
  });
}

/*
* This method will create a new user
*/
exports.createUser = function createUser(userInfo, dbConnection ,next) {
  usersBackend.createUser(userInfo, dbConnection, function (err, doc) {
    if(err)
      next(err, null);
    else{
      next(err, doc);
    }
  });
}

/*
* This method will delete a user
*/
exports.deleteUser = function deleteUser(broker, userID, dbConnection, next){

  exports.getEntities(userID, {}, dbConnection, function (error, docs) {
    if (error) {
      next(er ror, null);
    } else {
      var entities = docs;
      var deletedEntities = 0;

      if(entities.length > 0){
          for(var i = 0; i < entities.length; i++){
              var entityID = entities[i]._id;
              entityID = entityID.toString();

              exports.deleteEntity(broker, dbConnection, entityID, function(error, doc){
                  if(error)
                      next(error, null);
                  else{
                      deletedEntities += 1;

                      if(deletedEntities == entities.length){
                          usersBackend.removeByUserName(userID, dbConnection, function(err, doc) {
                              if(err)
                                  next(err, null);
                              else{
                                  next(err, doc);
                              }
                          });
                      }
                  }
              });
          }


      } else {
        usersBackend.removeByUserName(userID, dbConnection, function (err, doc) {
          if (err) {
            next(err, null);
          } else {
            next(err, doc);
          }

        });

      }

    }
    });    
}

/*
* This method will update the user pass
*/
exports.updateUserPass = function updateUserPass(userID, password, dbConnection, next){
  usersBackend.updateUserPassword(userID, password, dbConnection, function(err, doc) {
    if(err)
        next(err, null);
    else{
        next(err, doc);
    }

  });
}

/*
* This method will check if the password code exists
*/
exports.existsPasswordCode = function existsPasswordCode(userID, reset_code, dbConnection, next){
    usersBackend.existsPasswordCode(userID, reset_code, dbConnection, function(err, doc){
        if(err)
            next(err, null);
        else{
            next(err, doc);                        
        }
    });    
}

/*
* This method will delete the password code
*/
exports.deletePasswordCode = function deletePasswordCode(userID, dbConnection, next){
    usersBackend.deletePasswordCode(userID, dbConnection, function(error, doc){
        if(error)
            next(error, null);
        else{
            next(error, doc);                        
        }
    });    
}

/*
* This method will reset the user pass
*/
exports.resetUserPass = function resetUserPass(userID, reset_code, dbConnection, next){
    usersBackend.resetPasswordCode(userID, reset_code, dbConnection, function(error, result) {
        if(error)
            next(error, null);
        else{
            next(error, result);                        
        }
    });    
}
