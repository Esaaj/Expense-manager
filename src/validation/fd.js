const Joi = require('joi');

const fdValidationSchema = Joi.object({
  accountHolder: Joi.string().required().messages({
    'string.base': 'Account holder must be a string.',
    'any.required': 'Account holder is required.',
  }),
  principalAmount: Joi.number().required().min(0).messages({
    'number.base': 'Principal amount must be a number.',
    'number.min': 'Principal amount cannot be negative.',
    'any.required': 'Principal amount is required.',
  }),
  maturityDate: Joi.date().required().iso().messages({
    'date.base': 'Maturity date must be a date.',
    'date.isoDate': 'Invalid date format for maturity date.',
    'any.required': 'Maturity date is required.',
  }),
  interestRate: Joi.number().required().messages({
    'number.base': 'Interest rate must be a number.',
    'any.required': 'Interest rate is required.',
  }),
  lockInPeriod: Joi.number().required().messages({
    'number.base': 'Lock-in period must be a number.',
    'any.required': 'Lock-in period is required.',
  }),
});

const validateFd = (account) => {
  return fdValidationSchema.validate(account);
};

module.exports = {
  validateFd,
};