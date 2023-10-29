const Accounts = require('../models/accounts');
const { validateAccount } = require('../validation/accounts');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses');
const { calculateAccountBalance } = require('../helpers/accountBalance');

async function addAccounts(request, response) {
    try {
        const { userId } = request;
        const accountData = request.body;
        const { error } = validateAccount(accountData);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }
        accountData.userId = userId;
        const newAccount = await Accounts.create(accountData);
        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newAccount);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getAccounts(request, response) {
    try {
        const { userId } = request;
        const query = {
            userId,
            'removed.isRemoved': false,
        };
        const accountsInfo = await Accounts.find(query);

        // Create an array of promises for balance calculations
        const balancePromises = accountsInfo.map(async (account) => {
            const balance = await calculateAccountBalance(account._id);
            return { ...account._doc, balance }; // Combine the account info with the balance
        });

        // Wait for all balance calculations to complete
        const accountsWithBalances = await Promise.all(balancePromises);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, accountsWithBalances);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateAccounts(request, response) {
    try {
        const { accountId, ...rest } = request.body;
        const accountDetails = rest;
        const { error } = validateAccount(accountDetails);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }
        const updatedAccount = await Accounts.findByIdAndUpdate(accountId, accountDetails, { new: true });
        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedAccount);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteAccounts(request, response) {
    try {
        const { accountId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };
        const updatedAccount = await Accounts.findByIdAndUpdate(accountId, { $set: { removed } }, { new: true });
        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedAccount);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addAccounts,
    getAccounts,
    updateAccounts,
    deleteAccounts,
};
