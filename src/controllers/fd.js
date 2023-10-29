const FD = require('../models/fd'); // Import the FD model
const { validateFd } = require('../validation/fd');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function addFD(request, response) {
    try {
        const fdData = request.body;
        const { error } = validateFd(fdData);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }
        const newFD = await FD.create(fdData);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newFD);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getFDs(request, response) {
    try {
        const { userId } = request;
        const query = {
            userId,
            'removed.isRemoved': false,
        };
        const fds = await FD.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, fds);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateFD(request, response) {
    try {
        const updatedData = request.body;

        const updatedFD = await FD.findByIdAndUpdate(updatedData.fdId, updatedData, { new: true });

        if (!updatedFD) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'FD not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedFD);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteFD(request, response) {
    try {
        const { fdId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedFd = await FD.findByIdAndUpdate(fdId, { $set: { removed } }, { new: true });

        if (!updatedFd) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'FD not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedFd);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addFD,
    getFDs,
    updateFD,
    deleteFD,
};