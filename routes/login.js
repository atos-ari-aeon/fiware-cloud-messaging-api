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

var login = require("../controllers/login");
var errorsManagement = require('../controllers/errors');

/*
 * GET users listing.
 */



module.exports = function(app, passport, dbConnection) {

    function passportLogout(req, res, next){
    	req.logout();
    	next();
    }

    app.post('/login', passport.authenticate('local'), function(err, req, res, next) {
        // failure in login test route
        console.error("failure in login test route");
        console.error(err.stack);
        errorsManagement.sendError(errorsManagement.UNKNOWN_ERROR, res);

    }, login.login);

    app.get('/logout', passport.ensureAuthenticated, passportLogout, login.logout);

}

