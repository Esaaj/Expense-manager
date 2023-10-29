const RD = require('../models/rd'); // Import the FD model
const { validateRD } = require('../validation/rd');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function addRD(request, response) {
    try {
        const RdData = request.body;
        const { error } = validateRD(RdData);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }
        const newRD = await RD.create(RdData);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newRD);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getRDs(request, response) {
    try {
        const { userId } = request;
        const query = {
            userId,
            'removed.isRemoved': false,
        };
        const Rds = await RD.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, Rds);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateRD(request, response) {
    try {
        const updatedData = request.body;

        const updatedRD = await RD.findByIdAndUpdate(updatedData.rdId, updatedData, { new: true });

        if (!updatedRD) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'RD not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedRD);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteRD(request, response) {
    try {
        const { rdId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedRd = await RD.findByIdAndUpdate(rdId, { $set: { removed } }, { new: true });

        if (!updatedRd) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'RD not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedRd);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addRD,
    getRDs,
    updateRD,
    deleteRD,
};