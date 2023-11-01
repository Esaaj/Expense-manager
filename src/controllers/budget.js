const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const Budget = require('../models/budget');
const Transactions = require('../models/transactions');
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

async function getBudgetSummary(request, response) {
    try{
        const { userId } = request;
        const { budgetId } = request.query;
        const query = {
            userId,
            _id: budgetId,
            'removed.isRemoved': false,
        };
        const budget = await Budget.findOne(query);
        if (!budget) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'Budget not found.');
        }

        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);
        const type = 'active';
        
        if (!moment().isBetween(startDate, endDate)) {
            type = 'inactive';  
        }
        // find if current date is before start date
        if (moment().isBefore(startDate)) {
            type = 'scheduled';
        }

        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        const burnRate = budget.limitAmount/daysDifference;

        const budgetSummary = await Transactions.aggregate([
            {
                $match: {
                    userId: ObjectId(userId),
                    date: {
                        $gte: budget.startDate,
                        $lte: budget.endDate
                    },
                    type: 'expense',
                    'removed.isRemoved': false,
                },
            },
            {
                $group: {
                    _id: {
                        transactionType: '$type',
                        day: { $dayOfMonth: { $toDate: '$date' } },
                        date: '$date'
                    },
                    total: {
                        $sum: '$amount',
                    },
                    transactions: {
                        $push: {
                            description: '$description',
                            amount: '$amount',
                            date: '$date'
                        }
                    }
                },
            },
            {
                $group: {
                    _id: '$_id.type',
                    days: {
                        $push: {
                            day: '$_id.date',
                            total: '$total',
                            transactions: '$transactions'
                        },
                    },
                    total: {
                        $sum: '$total',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    startDate: budget.startDate, 
                    endDate: budget.endDate, 
                    limit: budget.limitAmount,
                    days: 1,
                    total: 1,
                    
                    remaining: {
                        $subtract: [budget.limitAmount, '$total'],
                    },
                    burnRate: burnRate,
                },
            },
        ]);
        
        const data = budgetSummary[0];
        data.dayCount = daysDifference;
        data.burnRate = burnRate;
        if(type === 'active') {
            const currentDaysDifference = (moment() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            const expectedAmountSpent = burnRate * currentDaysDifference;
            if(data.total > expectedAmountSpent) {
                data.status = 'over';
            } else {
                data.status = 'under';
            } 
        }
        
        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, data);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getBudgetSummary,
};
