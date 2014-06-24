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
 * This function shows the skeleton of a worker in the pub/sub chain
 * HTTP request and response as input.
 * When the job is done call to the next worker
 * 
 * Try to build workers as much autonomous as possible
 * to facilitate chains compositions
 *
 * Try to use the same consensous to call workers: workerTypeFuncionality:
 *  workerLogMongo, workerTopicLocations ....
 */

exports.dump = function workerDump(req, res, next) {

    // nothing to do, just next
    next();

}

