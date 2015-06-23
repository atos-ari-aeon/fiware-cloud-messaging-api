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

var channel = require("../controllers/channels/channel");
var errorsManagment = require('../controllers/errors.js');
var backendChannels = require('../core/backend/mongomodels/channeldb');
var topicWorkers = require('../core/pubsub/topic/dumpTopic');
var logWorkers = require('../core/pubsub/log/mongoLog');
var cooperationAgreementWorker = require('../core/pubsub/cooperation-agreement/dumpCA');
var logger = require('../logger.js');
var pubsub = require('../controllers/pubSub/pubsub');



module.exports = function(app, passport, dbConnection, broker) {

    function dumpWorker(req, res, next) {
        //logger.info("dumpWorker()");

        next();
    }


    function passDBConnection(req, res, next) {
        req.dbConnection = dbConnection;
        next();
    }

    function passBroker(req, res, next) {

        req.brokerConnection = broker;

        next();
    }

    function getChannel(req, res, next){

        if (!req.body)
            errorsManagment.sendError(errorsManagment.NOT_MESSAGE_PUBLISH, res);

        if(req.url.indexOf("publish")!=-1)
            pubSub = "pub";
        else if(req.url.indexOf("subscribe")!=-1)
            pubSub = "sub";
        else
            errorsManagment.sendError(errorsManagment.SUB_URL_NOT_EXISTS, res);

        if(pubSub == 'pub')
            backendChannels.findChannelByPubID(req.params.pubID, req.dbConnection, function(err, doc) {

                if (err)
                    errorsManagment.sendError(err, res);
                else {
                    req.entityID = doc._id;
                    req.channelID = doc.channels[0]._id;
                    req.AEONChannel = doc.channels[0];
                    next();
                }
            });
        else
            backendChannels.findChannelBySubID(req.params.subID, req.dbConnection, function(err, doc) {
                if (err)
                    errorsManagment.sendError(err, res);
                else {
                    req.entityID = doc._id;
                    req.channelID = doc.channels[0]._id;
                    req.AEONChannel = doc.channels[0];
                    next();
                }
            });

    }


    /*
     * Pub/Sub chain.
     * To publish the right chain will be formed by three steps:
     * step1: check the message correctness regarding the type of channel
     * step2: publish the message
     * step3: log the operation into the DDBB
     */

    var pubChain = {
        "workerstep1": topicWorkers.workerTopicDump,
        "workerstep2": channel.publish,
        "workerstep3": logWorkers.workerLogMessageMongo
    }


    app.post('/publish/:pubID', passDBConnection, passBroker, getChannel,
             pubChain.workerstep1,
             pubChain.workerstep2,
             pubChain.workerstep3,
             function (req, res){
                 logger.info("end of pub chain");
             }
            );

    /*
     * Pub/Sub chain.
     * To be subscribed the right chain will be formed by steps:
     *
     */

    var subscriptionsChain = {
        "workerstep1": cooperationAgreementWorker.workerCADump,
        "workerstep2": channel.getSubscription,
        "workerstep3": dumpWorker
    }

    app.get('/subscribe/config',passDBConnection, passBroker, pubsub.getConfig);

    app.get('/subscribe/:subID', passDBConnection, passBroker, getChannel,
            subscriptionsChain.workerstep1,
            subscriptionsChain.workerstep2,
            subscriptionsChain.workerstep3,
            function (req, res){
                console.log("end of pub chain");
            }
           );

    /*
     * Delete subscription.
     * Delete a subscription and its related queue
     *
     */

    app.delete('/subscribe/:subID', passDBConnection, passBroker, getChannel, pubsub.remove);

    /*
   * Some REST cilents dont allow to delete with a body.
   * So the next one will allow this operation with other semantic passing
   * the body as a query
   * We dont like too much but...
   *
   */
    app.post('/subscribe/:subID/delete', passDBConnection, passBroker, getChannel, function (req, res, next){
        req.body= {}
        req.body.id = req.query.id;
        req.body.desc = req.query.desc;
        next();
    },pubsub.remove);

}
