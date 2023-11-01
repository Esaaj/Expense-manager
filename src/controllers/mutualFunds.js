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

function calculateMutualFundMaturity(P, r) {
    const amount = P * (1 + (r / 100));
    return amount.toFixed(2);
}

async function getAllMutualFunds(request, response) {
  try {
    const { userId } = request;
    const query = {
        userId,
        'removed.isRemoved': false,
    };
    const projection = {
        name: 1,
        amount: 1,
        fundType: 1,
        riskLevel: 1,
        currentReturns: 1,
        expectedReturns: 1,
        depositDate: 1,
    };
    const mutualFunds = await MutualFund.find(query, projection).lean();
    mutualFunds.map(mutualFund => {
        mutualFund.currentValue = calculateMutualFundMaturity(mutualFund.amount, mutualFund.currentReturns);
        mutualFund.expectedValue = calculateMutualFundMaturity(mutualFund.amount, mutualFund.expectedReturns);
        mutualFund.monthsCompleted =  Math.floor((new Date() - new Date(mutualFund.depositDate)) / (1000 * 60 * 60 * 24 * 30));
    });

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