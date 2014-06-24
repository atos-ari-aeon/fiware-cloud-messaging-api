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
 * channels routes
 */

var channel = require("../controllers/channels/channel");
var errorsManagment = require('../controllers/errors.js');
var backendChannels = require('../core/backend/mongomodels/channeldb');
var topicWorkers = require('../core/pubsub/topic/dumpTopic');
var logWorkers = require('../core/pubsub/log/mongoLog');
var cooperationAgreementWorker = require('../core/pubsub/cooperation-agreement/dumpCA');
var logger = require('../logger.js');


module.exports = function(app, passport, dbConnection, broker) {

    function passDBConnection(req, res, next) {
        req.dbConnection = dbConnection;
        next();
    }

    function passBroker(req, res, next) {

        req.brokerConnection = broker;
        
        next();
    }
    
    app.get('/entities/:entity/channels', passport.ensureAuthenticated, passDBConnection, channel.list);
    app.get('/entities/:entity/channels/:channel', passport.ensureAuthenticated, passDBConnection, channel.info);
    app.post('/entities/:entity/channels', passport.ensureAuthenticated,
        passDBConnection, passBroker, channel.create);
    app.put('/entities/:entity/channels/:channel', passport.ensureAuthenticated,
        passDBConnection, channel.update);
    app.delete('/entities/:entity/channels/:channel', passport.ensureAuthenticated,
        passDBConnection, passBroker, channel.remove);    

}

