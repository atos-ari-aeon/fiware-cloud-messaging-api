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
 * exports cofiguratin for application server in development model
 *
 */


module.exports = {}
module.exports.env = 'development';
module.exports.logLevel = 'debug'; // { silly: 0, debug: 1, verbose: 2, info: 3, warn: 4, error: 5 }
// version info
module.exports.version = {}
module.exports.version.version = "0.2.1";
module.exports.version.codename = "Bolt";

// configuration for the external/proxy host
module.exports.protocol = 'http';
module.exports.extHost = '192.168.59.103';
module.exports.extPort = 3000;
// configuration for the internal deployed instance
module.exports.host = '0.0.0.0';
module.exports.port = 3000;
module.exports.secret = "default should be changed";

// configuration for the socketIO server
module.exports.socket_server_host = "192.168.59.103";
module.exports.socket_server_port = process.env.EVENTS_PORT_7789_TCP_PORT;

module.exports.SSL = false;
module.exports.key = 'cert/key.pem'; //only if ssl enabled
module.exports.cert = 'cert/cert.pem'; //only if ssl enabled

//configuration about the gui interface
module.exports.protocolGUI = 'http';
module.exports.extHostGUI = process.env.DASHBOARD_PORT_8000_TCP_ADDR;
module.exports.extPortGUI = process.env.DASHBOARD_PORT_8000_TCP_ADDR;

// contact info
module.exports.contact = "aeon-support@lists.atosresearch.eu";
module.exports.fullContact = "AEON Support <aeon-support@lists.atosresearch.eu>";

// reCaptcha keys

module.exports.reCaptchaPublic = "6LfpRe4SAAAAAK55U_PfaYxvogR-jHGRMJQp8ArW";
module.exports.reCaptchaPrivate = "6LfpRe4SAAAAACXMxzVFqtA39Q0m3VWFLZ-WBsCL";
