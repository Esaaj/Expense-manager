const Budget = require('../models/budget');
const { validateBudget } = require('../validation/budget');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function addBudget(request, response) {
    try {
        const { userId } = request;
        const budgetData = request.body;
        const { error } = validateBudget(budgetData);

        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        budgetData.userId = userId;

        const newBudget = await Budget.create(budgetData);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newBudget);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getBudgets(request, response) {
    try {
        const { userId } = request;
        const query = {
            userId,
            'removed.isRemoved': false,
        };

        const budgets = await Budget.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, budgets);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateBudget(request, response) {
    try {
        const { budgetId, ...rest } = request.body;
        const budgetDetails = rest;
        const { error } = validateBudget(budgetDetails);

        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        const updatedBudget = await Budget.findByIdAndUpdate(budgetId, budgetDetails, { new: true });

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedBudget);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteBudget(request, response) {
    try {
        const { budgetId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedBudget = await Budget.findByIdAndUpdate(budgetId, { $set: { removed } }, { new: true });

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedBudget);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
};
