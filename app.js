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

/**
 * Module dependencies.
 */

var express = require('express'),
    MongoStore = require('connect-mongo')(express),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    security = require('./security'),
    BrokerConnector = require('broker-manager').BrokerConnector,
    errorsManagement = require('./controllers/errors.js'),
    config = require('./config/config.js'),
    logger = require('./logger.js'),
    topicWorkers = require('./core/pubsub/topic/dumpTopic'),
    logWorkers = require('./core/pubsub/log/mongoLog'),
    cooperationAgreementWorker = require('./core/pubsub/cooperation-agreement/dumpCA'),
    channel = require("./controllers/channels/channel"),
    backendChannels = require('./core/backend/mongomodels/channeldb');


var app = express();

//winston.add(winston.transports.Console, { level: 'warn' });

//winston.log("helllooo");
/*
 * First we make the DDBB connection
 *
 */


logger.debug("Envirnonment " + process.env.NODE_ENV );

var MongoConnection = require('./core/backend/mongoConnection');
var mongoConnection = new MongoConnection(config.db);

// we connection will be ready you will access by dbConnection.getClient()
mongoConnection.createConnection();


/*
 * passport strategy for local DDBB
 */

security.initializePassport(passport, LocalStrategy, mongoConnection);


/*
 * Now we initialite the messages broker
 *
 */

brokerConnector = new BrokerConnector(config.connectorBroker);

brokerConnector.connect();

module.exports.BrokerConnector = brokerConnector;

/* performance test we pre-connect to one exchange */

//broker = module.exports.brokerConnection;

//exchangeOptions = { type : "fanout", durable: true};

//broker.on('ready', function() {
//    exchange = broker.exchange( name = "performance-test-2-14684378-exch", exchangeOptions, function(exchange) {


//        console.log("connect to exchange " + name );
//    });
//});

//console.log(exchange);

var singleServer = {
  "db" : config.db.db,
  "collection" : "express_sessions",
  "username" : config.db.username || "",
  "password" : config.db.password || "",
  "host" : config.db.host,
  "port" : config.db.port
}

//Solve CORS problems. We will have to change the Access-Control-Allow-Origin and forbid some incoming connections.
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-HTTP-Method-Override, X-Requested-With');
    res.header('Access-Control-Max-Age', '1800');
    res.header('Access-Control-Allow-Credentials', "true");

    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }

}

app.configure(function() {
    app.set('port', config.app.port || 3000);
    app.set('host', config.app.host);
//    app.set('views', __dirname + '/views');
//    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.app.secret,
        maxAge: new Date(Date.now() + 3600000),
        cookie: { path: '/', httpOnly: false, secure: false , persistent:true},
        key: 'aeon.sid',        
        store: new MongoStore(mongoConnection.config, function(db, err){
            if (err)
                console.log(err.message);
            else
                console.log("Connected to DB for sessions");
        })
    }));

    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(allowCrossDomain);
    app.use(app.router);
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.use('/public', express.directory(path.join(__dirname, 'public')));
    //  app.all('*', function(req, res, next)
    //    {
    //        req.dbConnection = module.exports.dbConnection;
    //        console.log("setted connection to " + req.database);
    //        next();
    //    });
    app.use(function(err, req, res, next) {        
        // console.error(err.stack);
        if (err instanceof SyntaxError) {
            errorsManagement.sendError(errorsManagement.INCORRECT_MODEL_ERROR, 400, res);
        } else {
            // console.log(err);
            res.send(500, 'Something broke!');
        }

    });
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

require('./routes/routes').routes(app, passport,
    mongoConnection, module.exports.BrokerConnector);



http.createServer(app).listen(app.get('port'), app.get('host'), function() {
    console.log("Express server listening on port " + app.get('port') + " " + app.get('host'));
});

