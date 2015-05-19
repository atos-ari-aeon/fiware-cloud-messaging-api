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
 * utils to response with common error JSON responses
 * useful to manage responses after exceptions
 */

/*
  * ERRORS:
  *
  * - Model: 10x
  * - Users: 20x
  * - Entities: 30x
  * - Channels: 40x
  * - Pub/Sub : 50x
  *	- Other: 60x
  *
  */

var logger = require('../logger.js');

exports.INCORRECT_MODEL_ERROR = new Error("Incorrect model received, check mandatory params and syntax");
exports.INCORRECT_MODEL_ERROR.msg = "Incorrect model received, check mandatory params and syntax";
exports.INCORRECT_MODEL_ERROR.code = 101;

exports.USER_NOT_EXISTS = new Error("User does not exist");
exports.USER_NOT_EXISTS.msg = "User does not exist";
exports.USER_NOT_EXISTS.code = 201;

exports.USER_EXISTS = new Error("User already exists");
exports.USER_EXISTS.msg = "User already exists";
exports.USER_EXISTS.code = 202;

exports.USER_INCORRECT_USER_ID = new Error("Incorrect UserID");
exports.USER_INCORRECT_USER_ID.msg = "Incorrect UserID";
exports.USER_INCORRECT_USER_ID.code = 203;

exports.WRONG_USER_PASSWORD = new Error("Wrong user/password");
exports.WRONG_USER_PASSWORD.msg = "Wrong user/password";
exports.WRONG_USER_PASSWORD.code = 204;

exports.NOT_AUTHENTICATED = new Error("Not authenticated");
exports.NOT_AUTHENTICATED.msg = "Not authenticated";
exports.NOT_AUTHENTICATED.code = 205;

exports.NOT_AUTHORIZED = new Error("You are not authorized for this operation");
exports.NOT_AUTHORIZED.msg = "You are not authorized for this operation";
exports.NOT_AUTHORIZED.code = 206;

exports.USER_RESET_PASSWORD = new Error("Error trying to reset user password");
exports.USER_RESET_PASSWORD.msg = "Error trying to reset user password";
exports.USER_RESET_PASSWORD.code = 207;

exports.USER_RESET_PASSWORD_INCORRECT = new Error("Error: reset code incorrect");
exports.USER_RESET_PASSWORD_INCORRECT.msg = "Error: reset code incorrect";
exports.USER_RESET_PASSWORD_INCORRECT.code = 208;

exports.USER_REST_EMAIL = new Error("Error sending reset email");
exports.USER_REST_EMAIL.msg = "Error sending reset email";
exports.USER_REST_EMAIL.code = 209


exports.WRONG_ENTITY_ID = new Error("The entity ID is not correct");
exports.WRONG_ENTITY_ID.msg = "The entity ID is not correct";
exports.WRONG_ENTITY_ID.code = 301;

exports.ENTITY_NOT_EXISTS = new Error("Entity does not exist");
exports.ENTITY_NOT_EXISTS.msg = "Entity does not exist";
exports.ENTITY_NOT_EXISTS.code = 302;

exports.WRONG_CHANNEL_ID = new Error("The channel ID is not correct");
exports.WRONG_CHANNEL_ID.msg = "The channel ID is not correct";
exports.WRONG_CHANNEL_ID.code = 401;

exports.CHANNEL_NOT_EXISTS = new Error("Channel does not exist");
exports.CHANNEL_NOT_EXISTS.msg = "Channel does not exist";
exports.CHANNEL_NOT_EXISTS.code = 402;

exports.CHANNEL_ERROR = new Error("Channel error");
exports.CHANNEL_ERROR.msg = "Channel error";
exports.CHANNEL_ERROR.code = 403;

exports.CHANNEL_UPDATE_ERROR = new Error("Error Updating Channel");
exports.CHANNEL_UPDATE_ERROR.msg = "Error Updating Channel";
exports.CHANNEL_UPDATE_ERROR.code = 404;

exports.REPLICATED_CHANNEL = new Error("More than one channel with the same id");
exports.REPLICATED_CHANNEL.msg = "More than one channel with the same id";
exports.REPLICATED_CHANNEL.code = 405;

exports.PUB_URL_NOT_EXISTS = new Error("Publication URL does not exist");
exports.PUB_URL_NOT_EXISTS.msg = "Publication URL does not exist";
exports.PUB_URL_NOT_EXISTS.code = 406;

exports.SUB_URL_NOT_EXISTS = new Error("Subscription URL does not exist");
exports.SUB_URL_NOT_EXISTS.msg = "Subscription URL does not exist";
exports.SUB_URL_NOT_EXISTS.code = 407;

exports.SUBSCRIPTION_NOT_EXIST = new Error("Subscription does not exist");
exports.SUBSCRIPTION_NOT_EXIST.msg = "Subscription does not exist";
exports.SUBSCRIPTION_NOT_EXIST.code = 408;

exports.SUBSCRIPTION_ALREADY_EXISTS = new Error("Subscription already exist. Check id and desc.");
exports.SUBSCRIPTION_ALREADY_EXISTS.msg = "Subscription already exist. Check id and desc.";
exports.SUBSCRIPTION_ALREADY_EXISTS.code = 409;

exports.CHANNEL_ADD_SUBSCRIPTION = new Error("Not able to store new subscription");
exports.CHANNEL_ADD_SUBSCRIPTION.msg = "Not able to store new subscription";
exports.CHANNEL_ADD_SUBSCRIPTION.code = 501;

exports.NOT_MESSAGE_PUBLISH = new Error("No message to publish");
exports.NOT_MESSAGE_PUBLISH.msg = "No message to publish";
exports.NOT_MESSAGE_PUBLISH.code = 502;

exports.NOT_SUPPORTED = new Error("Operation not supported... by the moment");
exports.NOT_SUPPORTED.msg = "Operation not supported... by the moment";
exports.NOT_SUPPORTED.code = 601;

exports.UNKNOWN_ERROR = new Error("Unknown error");
exports.UNKNOWN_ERROR.msg = "Unknown error";
exports.UNKNOWN_ERROR.code = 602;

exports.RECAPTCHA_ERROR = new Error("reCaptcha Error");
exports.RECAPTCHA_ERROR.msg = "Error validating code";
exports.RECAPTCHA_ERROR.code = 603;

exports.sendError = function (error, res){
    var code = undefined;
    switch(error.code){
            //HTTP 400: Bad Request
        case 602:
            code = 400;
            break;

            //HTTP 401: Not Authorized
        case 603:
        case 205:
        case 206:
            code = 401;
            break;

            //HTTP 404: Not Found
        case 201:
        case 302:
        case 402:
        case 403:
        case 406:
        case 407:
        case 408:
        case 502:
        case 701:
        case 801:
            code = 404;
            break;

            //HTTP 408: Request timeout

        case 404:
        case 409:
        case 501:
        case 702:
        case 703:
        case 802:
        case 803:
        case 804:
        case 805:
        case 806:
        case 807:
            code = 408;
            break;

            //HTTP 409: Conflict
        case 202:
        case 405:
        case 409:
        case 808:
            code = 409;
            break;

            //HTTP 417: Expectation failed
        case 101:
        case 203:
        case 204:
        case 301:
        case 401:
        case 406:
        case 407:
        case 408:
        case 901:
            code = 417;
            break;

            //HTTP 500: internal error
        case 207:
        case 208:
        case 209:
            code = 500;
            break;
            
            //HTTP 501: Not implemented
        case 601:
            code = 501;
            break;

        default:
            code = 500;
    };

    var newError = this.getErrorMessage (error);
    logger.error(JSON.stringify(newError));
    res.json(code, newError);

}

exports.getErrorMessage = function (error){
    var raiseError = {};
    raiseError.code = error.code;
    raiseError.desc = error.msg;
    //logger.error(JSON.stringify(raiseError));
    return raiseError;
}
