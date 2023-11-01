const Joi = require('joi');
const { interestType } = require('../helpers/enum');

const loansSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name must be a string.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string(),
    loanAmount: Joi.number().min(0).required().messages({
        'number.base': 'Loan amount must be a number.',
        'number.min': 'Loan amount cannot be negative.',
        'any.required': 'Loan amount is required.',
    }),
    startDate: Joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date string.',
        'date.format': 'Start date must be in the format of YYYY-MM-DD.',
        'any.required': 'Start date is required.',
    }),
    interest: Joi.number().min(0).required().messages({
        'number.base': 'Interest rate must be a number.',
        'number.min': 'Interest rate cannot be negative.',
        'any.required': 'Interest rate is required.',
    }),
    emi: Joi.number().min(0).required().messages({
        'number.base': 'EMI must be a number.',
        'number.min': 'EMI cannot be negative.',
        'any.required': 'EMI is required.',
    }),
    emiCompleted: Joi.number().min(0).required().messages({
        'number.base': 'EMI completed must be a number.',
        'number.min': 'EMI completed cannot be negative.',
        'any.required': 'EMI completed is required.',
    }),
    tenure: Joi.number().min(0).required().messages({
        'number.base': 'Tenure must be a number.',
        'number.min': 'Tenure cannot be negative.',
        'any.required': 'Tenure is required.',
    }),
    interestType: Joi.string().valid(...interestType).required().messages({
        'any.required': 'Interest type is required.',
        'string.base': 'Interest type must be a string.',
        'any.only': 'Invalid interest type.',
    }),
});

const validateLoan = (loan) => {
    return loansSchema.validate(loan);
};

module.exports = {
    validateLoan,
};
