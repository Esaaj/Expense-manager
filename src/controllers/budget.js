const Budget = require('../models/budgets');
const { validateBudget } = require('../validation/budgets');
const Constants = require('../helpers/constants');

// Create a new budget
const addBudget = (request, callback) => {
    const { userId } = request;
    const budgetData = request.body;
    const { error } = validateBudget(budgetData);

    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    budgetData.userId = userId;

    Budget.create(budgetData, (err, newBudget) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, newBudget);
    });
};

// Get all budgets for a user
const getBudgets = (request, callback) => {
    const { userId } = request;
    const query = {
        userId,
        'removed.isRemoved': false,
    };

    Budget.find(query, (err, budgets) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, budgets);
    });
};

// Update a budget by ID
const updateBudget = (request, callback) => {
    const { budgetId, ...rest } = request.body;
    const budgetDetails = rest;
    const { error } = validateBudget(budgetDetails);

    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    Budget.findByIdAndUpdate(budgetId, budgetDetails, { new: true }, (err, updatedBudget) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedBudget);
    });
};

// Delete a budget by ID
const deleteBudget = (request, callback) => {
    const { budgetId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };

    Budget.findByIdAndUpdate(budgetId, { $set: { removed } }, { new: true }, (err, updatedBudget) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedBudget);
    });
};

module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
};
