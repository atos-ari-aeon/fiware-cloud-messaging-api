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

exports.routes = function routes(app, passport, dbConnection, broker){

	require("./login")(app, passport, dbConnection);
	require("./user").routeUsers(app, passport, dbConnection, broker);
	require("./entity")(app, passport, dbConnection, broker);
	require("./channel")(app, passport, dbConnection, broker);
	require("./pubsub")(app, passport, dbConnection, broker);
	require("./echo")(app);
	require("./misc")(app);

}
