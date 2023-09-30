const RD = require('../models/rd'); // Import the RD model
const Constants = require('../helpers/constants');

// Create a new RD
const addRD = (request, callback) => {
    const rdData = request.body;

    RD.create(rdData, (err, newRD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, newRD);
    });
};

// Get all RDs
const getRDs = (request, callback) => {
    RD.find((err, rds) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, rds);
    });
};

// Get a specific RD by ID
const getRDById = (request, callback) => {
    const { rdId } = request.params;

    RD.findById(rdId, (err, rd) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!rd) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'RD not found',
            };
            return callback(response, null);
        }
        callback(null, rd);
    });
};

// Update a specific RD by ID
const updateRD = (request, callback) => {
    const { rdId } = request.params;
    const updatedData = request.body;

    RD.findByIdAndUpdate(rdId, updatedData, { new: true }, (err, updatedRD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!updatedRD) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'RD not found',
            };
            return callback(response, null);
        }
        callback(null, updatedRD);
    });
};

// Delete a specific RD by ID
const deleteRD = (request, callback) => {
    const { rdId } = request.params;

    RD.findByIdAndRemove(rdId, (err, deletedRD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!deletedRD) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'RD not found',
            };
            return callback(response, null);
        }
        callback(null, deletedRD);
    });
};

module.exports = {
  addRD,
  getRDs,
  getRDById,
  updateRD,
  deleteRD,
};
