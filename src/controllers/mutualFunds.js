const MutualFund = require('../models/mutualFunds');
const { validateMutualFund } = require('../validation/mutualFund');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function createMutualFund(request, response) {
  try {
    const mutualFundData = request.body;

    // Validate the Mutual Fund data
    const { error } = validateMutualFund(mutualFundData);
    if (error) {
      return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
    }

    const newMutualFund = await MutualFund.create(mutualFundData);

    return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newMutualFund);
  } catch (error) {
    return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
}

async function getAllMutualFunds(request, response) {
  try {
    const { userId } = request;
    const query = {
        userId,
        'removed.isRemoved': false,
    };
    const mutualFunds = await MutualFund.find({query});

    return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, mutualFunds);
  } catch (error) {
    return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
}

async function updateMutualFundById(request, response) {
  try {
    // Validate the updated data
    const { mutualFundId, ...rest } = request.body;
    const updatedData = rest;
    const { error } = validateMutualFund(updatedData);
    if (error) {
      return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
    }

    const updatedMutualFund = await MutualFund.findByIdAndUpdate(mutualFundId, updatedData, { new: true });

    if (!updatedMutualFund) {
      return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, Constants.ERROR_MSGS.MUTUAL_FUND_NOT_FOUND);
    }

    return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedMutualFund);
  } catch (error) {
    return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
}

async function deleteMutualFundById(request, response) {
  try {
    const { mutualFundId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };
    const updatedMutualFund = await MutualFund.findByIdAndUpdate(mutualFundId, { $set: { removed } }, { new: true });

    if (!updatedMutualFund) {
        return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'MutualFund not found');
    }

    return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedMutualFund);
  } catch (error) {
    return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
}

module.exports = {
  createMutualFund,
  getAllMutualFunds,
  updateMutualFundById,
  deleteMutualFundById,
};