const Transactions = require('../models/transactions');
const { validateTransaction } = require('../validation/transactions');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses');

const addTransactions = async (request, response) => {
    try {
        const { userId } = request;
        const transactionData = request.body;

        const { error } = validateTransaction(transactionData);

        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }


        if(transactionData !== 'transfer') {
            transactionData.userId = userId;
            await Transactions.create(transactionData);
        } else {
            const {description, amount, date, fromAccountId, toAccountId} = transactionData;
            const expenseData = {
                description, 
                amount, 
                date,
                type: 'expense',
                accountId: fromAccountId
            };
            const incomeData = {
                description,
                amount,
                date,
                type: 'income',
                accountId: toAccountId
            };
            await Promise.all([Transactions.create(expenseData), Transactions.create(incomeData)]);
        } else {
            transactionData.userId = userId;
            await Transactions.create(transactionData);
        }
                description, 
                amount, 
                date,
                type: 'income',
                accountId: toAccountId
            }
            await Transactions.create(expenseData);
            await Transactions.create(incomeData);
        }   
        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getTransactions = async (request, response) => {
    try {
        const { accountId } = request.query;
        const query = {
            accountId,
            'removed.isRemoved': false,
        };

        const transactions = await Transactions.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, transactions);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateTransactions = async (request, response) => {
    try {
        const { transactionId, ...rest } = request.body;
        const transactionDetails = rest;

        const updatedTransaction = await Transactions.findByIdAndUpdate(transactionId, transactionDetails, { new: true });

        if (!updatedTransaction) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'Transaction not found.');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedTransaction);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteTransactions = async (request, response) => {
    try {
        const { transactionId } = request.body;

        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedTransaction = await Transactions.findByIdAndUpdate(transactionId, { $set: { removed } }, { new: true });

        if (!updatedTransaction) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'Transaction not found.');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedTransaction);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    addTransactions,
    getTransactions,
    updateTransactions,
    deleteTransactions,
};