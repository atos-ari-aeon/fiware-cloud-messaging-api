/*jslint node: true, maxlen: 120*/
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
 * Mongo manager for user's models
 *
 */


var errorsManagment = require('../../../controllers/errors.js');
var logger = require('../../../logger.js');
var bcrypt = require('bcrypt');

module.exports.findUserByName = function findUser(userName, dbConnection, projection, next) {
    //logger.info("findUserByName(): finding user " + userName);

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  if (projection === null) {
    projection = {};
  }

  collection.find({
    "username": userName
  }, projection).toArray(function (err, docs) {

    if (err) {
      logger.info("userdb findUserByName UNKNOWN_ERROR: " + userName);
      next(errorsManagment.UNKNOWN_ERROR, null);
    } else {
      if (docs.length === 0) {
        logger.info("userdb findUserByName USER_NOT_EXISTS: " + userName);
        next(errorsManagment.USER_NOT_EXISTS, null);
      } else {
        //logger.info("userdb findUserByName: >0 y null? " + JSON.stringify(docs));
        next(null, docs);
      }
    }
  });
};

module.exports.findAll = function findAll(dbConnection, projection, next) {
  logger.info("findAll(): finding users ");

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  if (projection === null) {
    projection = {};
  }

  collection.find({}, projection).toArray(function (err, docs) {
    if (err) {
      next(errorsManagment.UNKNOWN_ERROR, null);
    }
    next(null, docs);
  });

};

module.exports.removeByUserName = function findUser(userName, dbConnection, next) {
  logger.info("removeByUserName(): deleting user " + userName);

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  collection.remove({
    "username": userName
  }, function (err, docs) {
    if (err) {
      next(errorsManagment.UNKNOWN_ERROR, null);
    }
    if (docs === 0) {
      next(errorsManagment.USER_NOT_EXISTS, null);
    } else {
      next(null, docs);
    }
  });
};

module.exports.createUser = function createUser(user, dbConnection, next) {
  logger.info("createUser(): creating user " + user.username);

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  user._id = user.username;

  bcrypt.genSalt(10, function (err, salt) { // number or round to generate salt (cost performance)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(errorsManagment.UNKNOWN_ERROR, null);
      }
      user.password = hash;

      collection.insert(user, function (err, docs) {
        if (err) {
          if (err.code === 11000) {
            logger.error("createUser(): " + errorsManagment.USER_EXISTS.msg + " " + user.username);
            return next(errorsManagment.USER_EXISTS, null);
          } else {
            logger.error("createUser(): " + errorsManagment.UNKNOWN_ERROR.msg + " " + user.username);
            return next(errorsManagment.UNKNOWN_ERROR, null);
          }
        }
        next(null, docs);
      });
    });
  });

};

module.exports.updateUserPassword = function updateUserPassword(userID, password, dbConnection, next) {
  logger.info("updateUserPassword(): updating user password of " + userID);

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  bcrypt.genSalt(10, function (err, salt) { // number or round to generate salt (cost performance)
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        return next(errorsManagment.UNKNOWN_ERROR, null);
      }
      collection.update({
        "username": userID
      }, {
        $set: {
          "password": hash
        }
      }, function (err, docs) {
        if (err) {
          next(errorsManagment.UNKNOWN_ERROR, null);
        } else {
          next(null, docs);
        }
      });
    });
  });
};

module.exports.resetPasswordCode = function resetPasswordCode(userID, code, dbConnection, next) {
  logger.info("resetPasswordCode(): setting code to reset password of " + userID);

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  collection.update({
    "username": userID
  }, {
    $set: {
      "resetpassword": code
    }
  }, function (err, docs) {
    if (docs === 0) {
      next(errorsManagment.USER_NOT_EXISTS, null);
    } else if (err) {
      next(errorsManagment.UNKNOWN_ERROR, null);
    } else {
      next(null, null);
    }
  });
};

module.exports.deletePasswordCode = function deletePasswordCode(userID, dbConnection, next) {
  logger.info("deletePasswordCode()");

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  collection.update({
    "username": userID
  }, {
    $unset: {
      "resetpassword": ""
    }
  }, function (err, docs) {
    if (docs === 0) {
      next(errorsManagment.USER_NOT_EXISTS, null);
    } else if (err) {
      next(errorsManagment.UNKNOWN_ERROR, null);
    } else {
      next(null, null);
    }
  });

};

module.exports.existsPasswordCode = function existsPasswordCode(userID, code, dbConnection, next) {
  logger.info("existsPasswordCode() ");

  collection = dbConnection.getClient().collection(dbConnection.config.collectionUsers);

  collection.find({
    "username": userID,
    "resetpassword": code
  }, {}).toArray(function (err, docs) {
    if (err) {
      next(errorsManagment.UNKNOWN_ERROR, null);
    } else {
      if (docs.length === 0) {
        next(errorsManagment.USER_NOT_EXISTS, null);
      } else {
        next(null, docs);
      }
    }
  });
};

