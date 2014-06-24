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
 * Controller for user resources
 */

var errorsManagment = require('../errors.js');
var responsesManagment = require('../responses.js');
var logger = require('../../logger.js');
var misc = require('../../core/misc/aeonmisc');
var manager = require('../../core/middleware/manager');


function checkUserModel(userModel) {
    // useless, just testing, username and password have been checked
    // for authentication
    //if ( ((!("username" in userModel)) || (!("password" in userModel)) || (!("type" in userModel)))
    //    && (userModel.type == "user"))

    if ((!("type" in userModel)) || (userModel.type != "user"))
        return false;

    return true;

}


function usersResponse(err, doc, res) {
    responsesManagment.sendResponse(err, res, doc)
}

exports.list = function(req, res) {
    logger.info("List of users");
    /*
     * It should response with a list of usersResponse
     * with no detailed information (just the public side)
     * more detailed info using the info operation
     */

    manager.getUsers(req.dbConnection, {
        'password': 0
    }, function(err, doc) {
        usersResponse(err, doc, res);
    });

};

exports.info = function(req, res) {
    logger.info("Info for user ", req.params.id);
    if (req.user._id != req.params.id)
        errorsManagment.sendError(errorsManagment.NOT_AUTHORIZED, res);
    else
        manager.getUserByName(req.params.id, req.dbConnection, {
            'password': 0
        }, function(err, doc) {
            usersResponse(err, doc, res);
        });

};

exports.cookieInfo = function(req, res) {
    logger.info("Info for user ", req.user._id);

    manager.getUserByName(req.user._id, req.dbConnection, {
        'password': 0
    }, function(err, doc) {
        usersResponse(err, doc, res);
    });

};

exports.remove = function(req, res) {
    logger.info("Delete user ", req.params.id);
    if (req.user._id != req.params.id)
        errorsManagment.sendError(errorsManagment.NOT_AUTHORIZED, res);
    else
        manager.deleteUser(req.brokerConnection, req.params.id, req.dbConnection, function(err, doc) {
            req.logout();
            usersResponse(err, doc, res);
        });
}

exports.create = function(req, res) {
    // lets try to do very light checks

    if (checkUserModel(req.body))
        manager.createUser(req.body, req.dbConnection, function(err, doc) {
            usersResponse(err, doc, res);
        });
    else
        errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);

}

exports.updateUserPass = function updateUserPass(req, res) {
    logger.info("Update user password");

    if (checkUserModel(req.body)) {
        if (req.user._id != req.params.id){
            errorsManagment.sendError(errorsManagment.NOT_AUTHORIZED, res);
        }
        else
            manager.updateUserPass(req.params.id, req.body.password, req.dbConnection, function(err, doc) {
                usersResponse(err, doc, res);
            });

    } else
        errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);
}

exports.resetUserPass = function resetUserPass(req, res) {
    logger.info("Reset user password");

    if (checkUserModel(req.body)) {
        var user = req.params.id;
        var reset_code = req.params.code;

        manager.getUserByName(user, req.dbConnection, {
            'password': 0
        }, function(error, doc) {
            if (error)
                errorsManagment.sendError(errorsManagment.USER_NOT_EXISTS, res);
            else {   

                manager.existsPasswordCode(user, reset_code, req.dbConnection, function(error, result) {
                    if (error)
                        errorsManagment.sendError(errorsManagment.USER_RESET_PASSWORD_INCORRECT, res);
                    else {
                        manager.updateUserPass(user, req.body.password, req.dbConnection, function(error, doc) {
                            if (error)
                                errorsManagment.sendError(errorsManagment.USER_RESET_PASSWORD, res);
                            else {
                                manager.deletePasswordCode(user, req.dbConnection, function(error, code) {
                                    if (error)
                                        errorsManagment.sendError(errorsManagment.USER_RESET_PASSWORD, res);
                                    else {
                                        misc.sendEmail(user, "User password changed",
                                                       misc.prepareResetPasswordEmail(user, reset_code),
                                                       "changedpassword",
                                                       function(error, result){
                                                           if (error)
                                                               errorsManagment.sendError(errorsManagment.USER_REST_EMAIL, res);
                                                           else                                                  
                                                                usersResponse(error, doc, res);
                                                       });

                                       
                                    }
                                });

                            }
                        });
                    }

                });
            }
        });

    } else
        errorsManagment.sendError(errorsManagment.INCORRECT_MODEL_ERROR, res);
}

exports.rememberUserPass = function rememberUserPass(req, res) {
    logger.info("Remember user password");

    var user = req.params.id;
    manager.getUserByName(user, req.dbConnection, {
        'password': 0
    }, function(error, doc) {
        if (error)
            errorsManagment.sendError(errorsManagment.USER_NOT_EXISTS, res);
        else {
            logger.info("Sending reset");
            var reset_code = misc.getUUID();
            manager.resetUserPass(user, reset_code, req.dbConnection, function(error, result) {
                if (error)
                    errorsManagment.sendError(errorsManagment.USER_RESET_PASSWORD, res);
                else {
                    var msg = "You will receive an email with information for reset."
                    misc.sendEmail(user, "Request for AEON's password reset",
                                   misc.prepareResetPasswordEmail(user, reset_code),
                                   "resetpassword",
                                   function(error, result) {
                                       if (error)
                                           errorsManagment.sendError(errorsManagment.USER_RESET_PASSWORD, res);
                                       else
                                           usersResponse(null, msg, res);

                                   });
                }
            })

        }

    });


}

