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
 Module to manage responses
 *
 */
 
 var errorsManagment = require('./errors.js');
 
 exports.getResponseMessage = function(err, data){
     if (err) {
        console.log(err);
        return errorsManagment.getErrorMessage(err.message, 400);
        
    } else {
        var response = {}
        response.code = 200;
        response.desc = "ok";
        if (Array.isArray(data))
            response.result = data;
        else
            response.result = [data];
        return response;
    }

 
 };
 exports.sendResponse = function (err, res, data) {
    if (err) {
        console.log(err);
        //console.log(errorsManagment);
        errorsManagment.sendError(err, res);
        
    } else {        
        //console.log(res['req']['sessionID'])
        
        var response = this.getResponseMessage(err, data);
        res.status(200);
        res.set("Connection", "close");
        res.send(response);
        
    }
};


