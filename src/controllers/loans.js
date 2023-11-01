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

function calculateLoanStatus(loanAmount, interestType, interest, emi, emiCompleted, tenure) {
    if(interestType === 'flat') {
        const amountPaid = emiCompleted * emi;
        const principalPaid = amountPaid - (amountPaid * interest * tenure/12) / 100;
        const interestPaid = amountPaid - principalPaid;
        const totalAmount = loanAmount + (loanAmount * interest * tenure/12) / 100;
        const totalInterest = totalAmount - loanAmount;
        const remainingBalance = loanAmount - amountPaid;
        const remainingPrincipal = loanAmount - principalPaid;
        const remainingInterest = totalInterest - interestPaid;
        const remainingTenure = tenure - emiCompleted;
        
        return {
            amountPaid: amountPaid.toFixed(2),
            principalPaid: principalPaid.toFixed(2),
            interestPaid: interestPaid.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            remainingBalance: remainingBalance.toFixed(2),
            remainingPrincipal: remainingPrincipal.toFixed(2),
            remainingInterest: remainingInterest.toFixed(2),
            remainingTenure: remainingTenure.toFixed(2)
        };
    } else if(interestType === 'reducing') {
        // FIX THIS LATER
        const amountPaid = emiCompleted * emi;
        const interestPerMonth = interest / 1200;
        const principalPaid = emi * ((1 - Math.pow(1 + interestPerMonth, tenure - emiCompleted)) / interestPerMonth);
        const interestPaid = amountPaid - principalPaid;
        const totalAmount = loanAmount + (loanAmount * interest * tenure/12) / 100;
        const totalInterest = totalAmount - loanAmount;
        const remainingBalance = loanAmount - amountPaid;
        const remainingPrincipal = loanAmount - principalPaid;
        const remainingInterest = totalInterest - interestPaid;
        const remainingTenure = tenure - emiCompleted;

        return {
            amountPaid: amountPaid.toFixed(2),
            principalPaid: principalPaid.toFixed(2),
            interestPaid: interestPaid.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            remainingBalance: remainingBalance.toFixed(2),
            remainingPrincipal: remainingPrincipal.toFixed(2),
            remainingInterest: remainingInterest.toFixed(2),
            remainingTenure: remainingTenure.toFixed(2)
        };
    }
}

async function getLoans(request, response) {
    try {
        const { userId } = request;

        const query = {
            userId,
            'removed.isRemoved': false,
        };

        const projection = {
            name: 1,
            description: 1,
            loanAmount: 1,
            startDate: 1,
            interest: 1,
            emi: 1,
            emiCompleted: 1, 
            tenure: 1,
            interestType: 1 
        }

        const loans = await Loans.find(query, projection).lean();
        loans.map(loan => {
            const loanStatus = calculateLoanStatus(loan.loanAmount, loan.interestType, loan.interest, loan.emi, loan.emiCompleted, loan.tenure);
            loan.loanStatus = loanStatus;
        });
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