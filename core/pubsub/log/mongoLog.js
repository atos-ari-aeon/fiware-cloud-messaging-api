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
 * Preconditions:
 * This function is considered as a worker in the pub/sub chain
 * So, this worker works in autonomous model
 * it expects the message in the req.body and the used channel in
 * req.AEONChannel, then log everything
 * into mongo.
 * Finally, invoke next worker
 *
 */

var logger = require('../../../logger.js');


exports.workerLogMessageMongo = function workerLogMessageMongo(req, res, next) {

    logger.info("Worker: workerLogMongo(): I will log message into mongo");

    var dbConnection = req.dbConnection;

    collection = dbConnection.getClient().collection(req.dbConnection.config.collectionLogs);

    log = {
        "message": req.body,
        "headers": req.headers,
        "channel": req.AEONChannel
    }

    collection.insert(log, function(err, docs) {
        if (err) 
            logger.error("Not logged message: " + log);
        next(null, docs);
    });

}

