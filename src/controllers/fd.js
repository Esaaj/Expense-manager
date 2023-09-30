const FD = require('../models/fd'); // Import the FD model
const Constants = require('../helpers/constants');

// Create a new FD
const addFD = (request, callback) => {
    const fdData = request.body;

    FD.create(fdData, (err, newFD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, newFD);
    });
};

// Get all FDs
const getFDs = (request, callback) => {
    FD.find((err, fds) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, fds);
    });
};

// Get a specific FD by ID
const getFDById = (request, callback) => {
    const { fdId } = request.params;

    FD.findById(fdId, (err, fd) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!fd) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'FD not found',
            };
            return callback(response, null);
        }
        callback(null, fd);
    });
};

// Update a specific FD by ID
const updateFD = (request, callback) => {
    const { fdId } = request.params;
    const updatedData = request.body;

    FD.findByIdAndUpdate(fdId, updatedData, { new: true }, (err, updatedFD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!updatedFD) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'FD not found',
            };
            return callback(response, null);
        }
        callback(null, updatedFD);
    });
};

// Delete a specific FD by ID
const deleteFD = (request, callback) => {
    const { fdId } = request.params;

    FD.findByIdAndRemove(fdId, (err, deletedFD) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        if (!deletedFD) {
            const response = {
                status: Constants.STATUS_CODE.NOT_FOUND,
                msg: 'FD not found',
            };
            return callback(response, null);
        }
        callback(null, deletedFD);
    });
};

module.exports = {
  addFD,
  getFDs,
  getFDById,
  updateFD,
  deleteFD,
};
