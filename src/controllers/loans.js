const Loans = require('../models/loans');
const { validateLoan } = require('../validation/loans');
const Constants = require('../helpers/constants');

// Create a new loan
const addLoan = (request, callback) => {
    const { userId } = request;
    const loanData = request.body;
    
    // Validate loan data
    const { error } = validateLoan(loanData);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    loanData.userId = userId;
    
    Loans.create(loanData, (err, newLoan) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, newLoan);
    });
};

// Get all loans for a user
const getLoans = (request, callback) => {
    const { userId } = request;
    
    const query = {
        userId,
        'removed.isRemoved': false,
    };

    Loans.find(query, (err, loans) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, loans);
    });
};

// Update an existing loan
const updateLoan = (request, callback) => {
    const { loanId, ...rest } = request.body;
    const loanDetails = rest;
    
    // Validate loan details
    const { error } = validateLoan(loanDetails);
    if (error) {
        const response = {
            status: Constants.STATUS_CODE.BAD_REQUEST,
            msg: error.details[0].message,
        };
        return callback(response, null);
    }

    Loans.findByIdAndUpdate(loanId, loanDetails, { new: true }, (err, updatedLoan) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedLoan);
    });
};

// Delete a loan
const deleteLoan = (request, callback) => {
    const { loanId } = request.body;
    const removed = {
        isRemoved: true,
        removedOn: new Date(),
    };

    Loans.findByIdAndUpdate(loanId, { $set: { removed } }, { new: true }, (err, updatedLoan) => {
        if (err) {
            const response = {
                status: Constants.STATUS_CODE.INTERNAL_SERVER_ERROR,
                msg: err.message,
            };
            return callback(response, null);
        }
        callback(null, updatedLoan);
    });
};

module.exports = {
    addLoan,
    getLoans,
    updateLoan,
    deleteLoan,
};
