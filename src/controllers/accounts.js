const Accounts = require('../models/accounts');
const { validateAccount } = require('../validation/accounts');
const Constants = require('../helpers/constants');

const addAccounts = (request, callback) => {
    const { userId } = request;
    const accountData = request.body;
    const { error } = validateAccount(accountData);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }
    accountData.userId = userId;
    Accounts.create(accountData, (err, newAccount) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, newAccount);
    });
};

const getAccounts = (request, callback) => {
    const { userId } = request;
    const query = {
        userId,
        'removed.isRemoved' : false,
    }
    Accounts.find(query, (err, accounts) => {
        if (err) {
        const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
        };
        return callback(response, null);
        }
        callback(null, accounts);
    });
};

const updateAccounts = (request, callback) => {
    const { accountId, ...rest } = request.body;
    const accountDetails = rest;
    const { error } = validateAccount(accountDetails);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }
    Accounts.findByIdAndUpdate(accountId, accountDetails, { new: true }, (err, updatedAccount) => {
        if (err) {
            const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedAccount);
    });
};

const deleteAccounts = (request, callback) => {
    const { accountId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };
    Accounts.findByIdAndUpdate(accountId, { $set: { removed } }, { new: true }, (err, updatedAccount) => {
        if (err) {
            const response = {
            status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
            msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedAccount);
    });
};

module.exports = {
  addAccounts,
  getAccounts,
  updateAccounts,
  deleteAccounts,
};
