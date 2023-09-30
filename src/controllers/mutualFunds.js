const MutualFund = require('../models/mutualFund');
const { validateMutualFund } = require('../validation/mutualFund');
const Constants = require('../helpers/constants');

// Create a new Mutual Fund
const createMutualFund = (request, callback) => {
  const mutualFundData = request.body;

  // Validate the Mutual Fund data
  const { error } = validateMutualFund(mutualFundData);
  if (error) {
    const response = {
      status: Constants.STATUS_CODE.BAD_REQUEST,
      msg: error.details[0].message,
    };
    return callback(response, null);
  }

  MutualFund.create(mutualFundData, (err, newMutualFund) => {
    if (err) {
      const response = {
        status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: err.message,
      };
      return callback(response, null);
    }
    callback(null, newMutualFund);
  });
};

// Get all Mutual Funds
const getAllMutualFunds = (callback) => {
  MutualFund.find({}, (err, mutualFunds) => {
    if (err) {
      const response = {
        status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: err.message,
      };
      return callback(response, null);
    }
    callback(null, mutualFunds);
  });
};

// Get a specific Mutual Fund by ID
const getMutualFundById = (mutualFundId, callback) => {
  MutualFund.findById(mutualFundId, (err, mutualFund) => {
    if (err) {
      const response = {
        status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: err.message,
      };
      return callback(response, null);
    }
    if (!mutualFund) {
      const response = {
        status: Constants.STATUS_CODE.NOT_FOUND,
        msg: 'Mutual Fund not found.',
      };
      return callback(response, null);
    }
    callback(null, mutualFund);
  });
};

// Update a specific Mutual Fund by ID
const updateMutualFundById = (mutualFundId, updatedData, callback) => {
  // Validate the updated data
  const { error } = validateMutualFund(updatedData);
  if (error) {
    const response = {
      status: Constants.STATUS_CODE.BAD_REQUEST,
      msg: error.details[0].message,
    };
    return callback(response, null);
  }

  MutualFund.findByIdAndUpdate(mutualFundId, updatedData, { new: true }, (err, updatedMutualFund) => {
    if (err) {
      const response = {
        status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: err.message,
      };
      return callback(response, null);
    }
    if (!updatedMutualFund) {
      const response = {
        status: Constants.STATUS_CODE.NOT_FOUND,
        msg: 'Mutual Fund not found.',
      };
      return callback(response, null);
    }
    callback(null, updatedMutualFund);
  });
};

// Delete a specific Mutual Fund by ID
const deleteMutualFundById = (mutualFundId, callback) => {
  MutualFund.findByIdAndRemove(mutualFundId, (err, deletedMutualFund) => {
    if (err) {
      const response = {
        status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
        msg: err.message,
      };
      return callback(response, null);
    }
    if (!deletedMutualFund) {
      const response = {
        status: Constants.STATUS_CODE.NOT_FOUND,
        msg: 'Mutual Fund not found.',
      };
      return callback(response, null);
    }
    callback(null, { msg: 'Mutual Fund deleted successfully.' });
  });
};

module.exports = {
  createMutualFund,
  getAllMutualFunds,
  getMutualFundById,
  updateMutualFundById,
  deleteMutualFundById,
};
