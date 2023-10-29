const Joi = require('joi');

// Define the validation schema for RD data
const rdSchema = Joi.object({
  accountHolder: Joi.string().required().messages({
    'string.base': 'Account holder must be a string.',
    'any.required': 'Account holder is required.',
  }),
  monthlyDeposit: Joi.number().min(0).required().messages({
    'number.base': 'Monthly deposit must be a number.',
    'number.min': 'Monthly deposit cannot be negative.',
    'any.required': 'Monthly deposit is required.',
  }),
  maturityDate: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Maturity date must be a valid date.',
    'date.isoDate': 'Maturity date must be in ISO format.',
    'date.greater': 'Maturity date must be in the future.',
    'any.required': 'Maturity date is required.',
  }),
  interestRate: Joi.number().min(0).required().messages({
    'number.base': 'Interest rate must be a number.',
    'number.min': 'Interest rate cannot be negative.',
    'any.required': 'Interest rate is required.',
  }),
  installmentTenure: Joi.number().integer().min(1).required().messages({
    'number.base': 'Installment tenure must be a number.',
    'number.integer': 'Installment tenure must be an integer.',
    'number.min': 'Installment tenure must be at least 1.',
    'any.required': 'Installment tenure is required.',
  }),
});

// Export the validation function
const validateRD = (rd) => {
  return rdSchema.validate(rd);
};

module.exports = {
  validateRD,
};
