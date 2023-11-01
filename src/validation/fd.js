const Joi = require('joi');

const fdValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Account holder must be a string.',
    'any.required': 'Account holder is required.',
  }),
  amount: Joi.number().required().min(0).messages({
    'number.base': 'Principal amount must be a number.',
    'number.min': 'Principal amount cannot be negative.',
    'any.required': 'Principal amount is required.',
  }),
  maturityDate: Joi.date().iso().greater('now').required().messages({
    'date.base': 'Maturity date must be a valid date.',
    'date.format': 'Maturity date must be in the format YYYY-MM-DD.',
    'date.greater': 'Maturity date must be in the future.',
    'any.required': 'Maturity date is required.',
  }),
  depositDate: Joi.date().iso().messages({
    'date.base': 'depositDate must be a valid date string.',
    'date.format': 'depositDate must be in the format of YYYY-MM-DD.',
    'date.format': 'depositDate must be in the format of YYYY-MM-DD.',
  }),
  interestRate: Joi.number().required().min(0).messages({
    'number.base': 'Interest rate must be a number.',
    'number.min': 'Interest rate cannot be negative.',
    'number.min': 'Interest rate cannot be negative.',
    'any.required': 'Interest rate is required.',
  }),
  lockInPeriod: Joi.number().required().messages({
    'number.base': 'Lock-in period must be a number.',
    'any.required': 'Lock-in period is required.',
  }),
  compoundingFrequency: Joi.number().required().messages({
    'number.base': 'Compounding Frequency period must be a number.',
    'any.required': 'Compounding Frequency period is required.',
  }),
});

const validateFd = (account) => {
  return fdValidationSchema.validate(account);
};

module.exports = {
  validateFd,
};