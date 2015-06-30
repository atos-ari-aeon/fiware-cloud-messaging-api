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
 * Just some misc tools
 *
 */

var path = require('path'),
    templatesDir = path.resolve(__dirname, '../../', 'templates'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer'),
    config = require('../../config/config.js'),
    logger = require('../../logger.js');

module.exports.getUUID = function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

}

module.exports.prepareResetPasswordEmail = function prepareResetEmail(to, code) {

    return {
        useremail: to,
        aeoncontact: config.app.contact,
        reseturl: config.app.protocolGUI + "://" + config.app.extHostGUI + ":" + config.app.extPortGUI + "/app/index.html#/createPassword",
        dashboardurl: config.app.protocolGUI + "://" + config.app.extHostGUI + ":" + config.app.extPortGUI + "/app/index.html",
        logourl: config.app.protocolGUI + "://" + config.app.extHost + ":" + config.app.extPort + "/public/logo.png",
        atoslogourl: config.app.protocolGUI + "://" + config.app.extHost + ":" + config.app.extPort + "/public/atos.png",
        weblogo: config.app.protocolGUI + "://" + config.app.extHost + ":" + config.app.extPort + "/public/web.png",
        twitterlogo: config.app.protocolGUI + "://" + config.app.extHost + ":" + config.app.extPort + "/public/twitterlogo.png",
        code: code

    };

}

module.exports.prepareChangePasswordEmail = function prepareResetEmail(to, code) {

    return {
        useremail: to,
        aeoncontact: config.app.contact,
        logourl: config.app.protocol + "://" + config.app.extHost + ":" + config.app.extPort + "/public/logo.png"

    };

}
module.exports.sendEmail = function sendEmail(to, subject, emailInfo, templateName, next) {

    emailTemplates(templatesDir, function(error, template) {

        if (error){
            logger.error(error);
            next(error, null);
        } else {
            // for the transport, maybe in the future we will use directly
            // our own SMTP
            var transport = nodemailer.createTransport("direct");

            template(templateName, emailInfo, function(error, html, text) {

                if (error) {
                    logger.error(error);
                    next(error, null);
                }else {
                    transport.sendMail({
                        forceEmbeddedImages: true,
                        encoding: "utf8",
                        alternatives: [
                            {
                                contentType: "text/html",
                            }
                        ],
                        from: config.app.fullContact,
                        to: to,
                        subject: subject,
                        html: html
                        // generateTextFromHTML: true,

                    }, function(error, responseStatus) {
                        if (error){
                          logger.error("aeonmisc transport.sendEmail(): ",JSON.stringify(error));
                            next(error, null);
                            return;
                        }

                        // response.statusHandler only applies to 'direct' transport
                        responseStatus.statusHandler.once("failed", function(data){
                            logger.error(
                                "Permanently failed delivering message to %s with the following response: %s",
                                data.domain, data.response);
                            next(true,data);
                        });

                        responseStatus.statusHandler.once("requeue", function(data){
                            logger.error("Temporarily failed delivering message to %s", data.domain);
                            next(true,data);
                        });

                        responseStatus.statusHandler.once("sent", function(data){
                            //logger.info("Message was accepted by %s", data.domain);
                            next(null, data);
                        });
                        //next(null, responseStatus);
                        
                    });
                }
            });


        }

    });

}

