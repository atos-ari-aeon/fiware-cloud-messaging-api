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

entity = require("../controllers/entities/entity");

/*
 * GET users listing.
 */

module.exports = function(app, passport, dbConnection, broker){


    function passDBConnection(req, res, next) {
        req.dbConnection = dbConnection;
        next();
    }

    function passBroker(req, res, next) {

        req.brokerConnection = broker;
        
        next();
    }
    
    app.get('/entities', passport.ensureAuthenticated, passDBConnection, entity.list);
    app.get('/entities/:entity', passport.ensureAuthenticated, passDBConnection, entity.info);
    app.post('/entities', passport.ensureAuthenticated, passDBConnection, entity.create);
    app.put('/entities/:entity', passport.ensureAuthenticated, passDBConnection, entity.update);
    app.delete('/entities/:entity', passport.ensureAuthenticated,passDBConnection, passBroker, entity.remove);

}
