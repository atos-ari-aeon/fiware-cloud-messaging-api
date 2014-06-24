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

var user = require("../controllers/users/user");
var Recaptcha = require('recaptcha').Recaptcha;
var errorsManagment = require('../controllers/errors.js');
var responsesManagment = require('../controllers/responses.js');
var config = require('../config/config.js');
/*
 * GET users listing.
 */


exports.routeUsers = function routeUsers(app, passport, dbConnection, broker) {

    function reCaptcha(req, res, next){

        var data = {
            remoteip:  req.connection.remoteAddress,
            challenge: req.body.captchaData.challenge,
            response:  req.body.captchaData.response
        };

        var recaptcha = new Recaptcha(config.app.reCaptchaPublic, config.app.reCaptchaPrivate, data);

        recaptcha.verify(function(success, error_code) {
            if (success){
                delete req.body.captchaData;
                return next();
            } else{
                errorsManagment.sendError(errorsManagment.RECAPTCHA_ERROR, res);
            }
        });

    }

    function passDBConnection(req, res, next) {
        req.dbConnection = dbConnection;
        next();
    }

    function passBroker(req, res, next) {

        req.brokerConnection = broker;

        next();
    }

    app.delete('/users/:id', passport.ensureAuthenticated, passDBConnection, passBroker, user.remove);
    app.get('/users', passport.ensureAuthenticated, passDBConnection, user.list);
    app.get('/users/user', passport.ensureAuthenticated, passDBConnection, user.cookieInfo);
    app.get('/users/:id', passport.ensureAuthenticated, passDBConnection, user.info);
    app.get('/users/:id/rememberPassword', passDBConnection, user.rememberUserPass);
    app.post('/users', reCaptcha, passDBConnection, user.create);
    app.put('/users/:id/updatePassword', passport.ensureAuthenticated, passDBConnection, user.updateUserPass);
    app.put('/users/:id/rememberPassword/:code', passDBConnection, user.resetUserPass);


}


