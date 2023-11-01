const Joi = require('joi');

// Define the validation schema for RD data
const rdSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'name is required',
    'string.empty': 'name cannot be empty',
  }),
  monthlyDeposit: Joi.number().required().messages({
    'any.required': 'Monthly deposit amount is required',
    'number.base': 'Monthly deposit amount must be a number',
  }),
  maturityDate: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Maturity date must be a valid date.',
    'date.format': 'Maturity date must be in the format YYYY-MM-DD.',
    'date.greater': 'Maturity date must be in the future.',
    'any.required': 'Maturity date is required.',
  }),
  startDate: Joi.date().iso().messages({
    'date.base': 'startDate must be a valid date string.',
    'date.format': 'startDate must be in the format of YYYY-MM-DD.',
    'date.format': 'startDate must be in the format of YYYY-MM-DD.',
  }),
  interestRate: Joi.number().required().messages({
    'any.required': 'Interest rate is required',
    'number.base': 'Interest rate must be a number',
  }),
  installmentTenure: Joi.number().required().messages({
    'any.required': 'Installment tenure is required',
    'number.base': 'Installment tenure must be a number',
  }),
  completedMonths: Joi.number().required().messages({
    'any.required': 'Completed months is required',
    'number.base': 'Completed months must be a number',
  }),
});

// Export the validation function
const validateRD = (rd) => {
  return rdSchema.validate(rd);
};

module.exports = {
  validateRD,
};
