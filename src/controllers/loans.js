const Loans = require('../models/loans');
const { validateLoan } = require('../validation/loans');
const Constants = require('../helpers/constants');
const Response = require('../helpers/responses'); // Import the Response module

async function addLoan(request, response) {
    try {
        const { userId } = request;
        const loanData = request.body;

        // Validate loan data
        const { error } = validateLoan(loanData);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        loanData.userId = userId;

        const newLoan = await Loans.create(loanData);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, newLoan);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function getLoans(request, response) {
    try {
        const { userId } = request;

        const query = {
            userId,
            'removed.isRemoved': false,
        };

        const loans = await Loans.find(query);

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, loans);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function updateLoan(request, response) {
    try {
        const { loanId, ...rest } = request.body;
        const loanDetails = rest;

        // Validate loan details
        const { error } = validateLoan(loanDetails);
        if (error) {
            return Response.sendResponse(response, Constants.STATUS_CODE.BAD_REQUEST, error.details[0].message);
        }

        const updatedLoan = await Loans.findByIdAndUpdate(loanId, loanDetails, { new: true });

        if (!updatedLoan) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'Loan not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedLoan);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

async function deleteLoan(request, response) {
    try {
        const { loanId } = request.body;
        const removed = {
            isRemoved: true,
            removedOn: new Date(),
        };

        const updatedLoan = await Loans.findByIdAndUpdate(loanId, { $set: { removed } }, { new: true });

        if (!updatedLoan) {
            return Response.sendResponse(response, Constants.STATUS_CODE.NOT_FOUND, 'Loan not found');
        }

        return Response.sendResponse(response, Constants.STATUS_CODE.OK, Constants.INFO_MSGS.SUCCESS, updatedLoan);
    } catch (error) {
        return Response.sendResponse(response, Constants.STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    addLoan,
    getLoans,
    updateLoan,
    deleteLoan,
};