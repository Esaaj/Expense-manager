const Transactions = require('../models/transactions');
const { validateTransaction } = require('../validation/transactions');
const Constants = require('../helpers/constants');

const addTransactions = (request, callback) => {
    const { userId } = request;
    const transactionData = request.body;
    const { error } = validateTransaction(transactionData);
    if (error) {
        const response = {
        status: Constants.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
        };
        return callback(response, null);
    }
    transactionData.userId = userId;
    Transactions.create(transactionData, (err, newTransaction) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, newTransaction);
    });
};

const getTransactions = (request, callback) => {
    const { accountId } = request.query;
    const query = {
        accountId,
        'removed.isRemoved' : false,
    }
    Transactions.find(query, (err, transactions) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, transactions);
    });
};

const updateTransactions = (request, callback) => {
    const { transactionId, ...rest } = request.body;
    const transactionDetails = rest;
    Transactions.findByIdAndUpdate(transactionId, transactionDetails, { new: true }, (err, updatedTransaction) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, updatedTransaction);
    });
};

const deleteTransactions = (request, callback) => {
    const { transactionId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };
    Transactions.findByIdAndUpdate(transactionId, { $set: { removed } }, { new: true }, (err, updatedTransaction) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, updatedTransaction);
    });
};

module.exports = {
  addTransactions,
  getTransactions,
  updateTransactions,
  deleteTransactions,
};
