const Users = require("../models/users");
const JWT = require("jsonwebtoken");
const Constants = require('../helpers/constants');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');

function comparePasswords(password, hashedPassword, callback) {
    bcrypt.compare(password, hashedPassword, (error, match) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, match);
    });
  }
  
function login(userDetails, callback) {
    const { email, password } = userDetails;

    Users.findOne({ email }, (err, foundUser) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.BAD_REQUEST,
                msg: err,
            };
            callback(response, null);
            return;
        }

        comparePasswords(password, foundUser.password, (compareErr, isMatch) => {
            if (compareErr) {
                const response = {
                    status: Constants.STATUS_CODE.BAD_REQUEST,
                    msg: Constants.ERROR_MSGS.AUTH_FAIL,
                };
                callback(response, null);
                return;
            }

            if (isMatch) {
                const response = {
                    status: Constants.STATUS_CODE.OK,
                    msg: Constants.INFO_MSGS.SUCCESS,
                    token: JWT.sign({ user: foundUser.email, userId: foundUser._id }, JWT_SECRET),
                };
                callback(null, response);
            } else {
                const response = {
                status: Constants.STATUS_CODE.BAD_REQUEST,
                msg: Constants.ERROR_MSGS.AUTH_FAIL,
                };
                callback(response, null);
            }
        });
    });
}

module.exports.login = login;