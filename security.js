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
 * Security configuration based on passport
 * local strategy
 *
 */

var backend = require('./core/backend/mongomodels/userdb');
var errorsManagment = require('./controllers/errors.js');
var responsesManagment = require('./controllers/responses.js');
var bcrypt = require('bcrypt');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated");
        return next();
    }

    errorsManagment.sendError(errorsManagment.NOT_AUTHENTICATED,res);

};


function serializeUser(user, done) {
    done(null, user._id);
};

function deserializeUser(id, done) {
    backend.findUserByName(id, module.exports.dbConnection, null, function(err, users) {
        if ((err) || (users.length != 1)) {
            console.log("Error, received cookie but user does not exist");
            done(null, false);
        } else {
            done(null, users[0]);
        };

    });
};



function authenticateUser(username, password, done) {

    backend.findUserByName(username, module.exports.dbConnection, null, function(err, users) {

        if ((!users) || (users.length != 1)) {
            console.log("No only one user");
            console.log(done);
            done(null, false, responsesManagment.getResponseMessage(
                new Error(errorsManagment.WRONG_USER_PASSWORD), null));
        } else {
            var user = users[0];
            if (err)
                done(err, null);
            if (username != user.username) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err || !isMatch) 
                    return done(null, false);
                console.log("ok login");
                done(null, user);
            });

            
        }
    });
    
};

module.exports.initializePassport = function(passport, LocalStrategy, getDBConnection) {

    passport.ensureAuthenticated = ensureAuthenticated;

    passport.serializeUser = serializeUser;

    passport.deserializeUser = deserializeUser;

    passport.use(new LocalStrategy(authenticateUser));

    module.exports.dbConnection = getDBConnection;


};

