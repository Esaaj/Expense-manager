const Users = require("../models/users");
const JWT = require("jsonwebtoken");
const Constants = require('../helpers/constants');
const { JWT_SECRET, ACCESSTOKENLIFETIME, REFRESHTOKENLIFETIME } = process.env;
const bcrypt = require('bcrypt');
const Response = require('../helpers/responses');

async function comparePasswords(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (error, match) => {
            if (error) {
                reject(error);
            }
            resolve(match);
        });
    });
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const usersInfo = await Users.findOne({ email });

        if (!usersInfo) {
            return Response.sendResponse(res, Constants.STATUS_CODE.BAD_REQUEST, err);
        }

        const isMatch = await comparePasswords(password, usersInfo.password);

        if (isMatch) {
            const accessToken = JWT.sign({ user: usersInfo.email, userId: usersInfo._id }, JWT_SECRET, { expiresIn: ACCESSTOKENLIFETIME });
            const refreshToken = JWT.sign({ user: usersInfo.email, userId: usersInfo._id }, JWT_SECRET, { expiresIn: REFRESHTOKENLIFETIME });
            return Response.sendResponse(res, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, { accessToken, refreshToken });
        } else {
            return Response.sendResponse(res, Constants.STATUS_CODE.BAD_REQUEST, Constants.ERROR_MSGS.AUTH_FAIL);
        }
    } catch (error) {
        return Response.sendResponse(res, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

function refresh(req, res) {
    try {
        const { refreshToken } = req.body;
    
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return Response.sendResponse(res, Constants.STATUS_CODE.UN_AUTHORIZED, Constants.ERROR_MSGS.AUTH_FAIL);
        }
    
        const user = jwt.decode(refreshToken);
        if (!user) {
            return Response.sendResponse(res, Constants.STATUS_CODE.UN_AUTHORIZED, Constants.ERROR_MSGS.AUTH_FAIL);
        }

        const accessToken = JWT.sign({ user: usersInfo.email, userId: usersInfo._id }, JWT_SECRET, { expiresIn: ACCESSTOKENLIFETIME });
        return Response.sendResponse(res, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, { accessToken });
    } catch (error) {
        return Response.sendResponse(res, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = { login, refresh };