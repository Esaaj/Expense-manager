const Constants = require('../helpers/constants');
const Response = require('../helpers/responses');
const User = require('../models/users'); 

// Add a new user
const addUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        Response.sendResponse(res, Constants.STATUS_CODE.CREATED, Constants.INFO_MSGS.SUCCESS, savedUser);
    } catch (error) {
        Response.sendResponse(res, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get a user by their ID
const getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return Response.sendResponse(res, Constants.STATUS_CODE.NOT_FOUND, 'User not found');
        }
        Response.sendResponse(res, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, user);
    } catch (error) {
        Response.sendResponse(res, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Update a user by their ID
const updateUser = async (req, res) => {
    try {
        const { userId } = req;
        const updatedData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return Response.sendResponse(res, Constants.STATUS_CODE.NOT_FOUND, 'User not found');
        }

        Response.sendResponse(res, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedUser);
    } catch (error) {
        Response.sendResponse(res, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Your getAccounts function...

module.exports = {
    addUser,
    getUser,
    updateUser,
};
