const Joi = require('joi');
const { fundType, riskLevel } = require('../helpers/enum');

// Define the validation schema for Mutual Fund data
const mutualFundSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Fund name must be a string.',
    'any.required': 'Fund name is required.',
  }),
  amount: Joi.number().min(0).required().messages({
    'number.base': 'Investment amount must be a number.',
    'number.min': 'Investment amount cannot be negative.',
    'any.required': 'Investment amount is required.',
  }),
  fundType: Joi.string().required().valid(...fundType).messages({
    'string.base': 'Fund type must be a string.',
    'any.required': 'Fund type is required.',
    'any.only': 'Invalid fundType',
  }),
  riskLevel: Joi.string().required().valid(...riskLevel).messages({
    'string.base': 'Risk level must be a string.',
    'any.required': 'Risk level is required.',
    'any.only': 'Invalid riskLevel',
  }),
  currentReturns: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Current returns must be a number.',
    'number.min': 'Current returns cannot be negative.',
    'number.max': 'Current returns cannot be greater than 100.',
    'any.required': 'Current returns is required.',
  }),
  expectedReturns: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Expected returns must be a number.',
    'number.min': 'Expected returns cannot be negative.',
    'number.max': 'Expected returns cannot be greater than 100.',
    'any.required': 'Expected returns is required.',
  }),
  depositDate: Joi.date().iso().messages({
    'date.base': 'depositDate must be a valid date string.',
    'date.format': 'depositDate must be in the format of YYYY-MM-DD.',
    'date.format': 'depositDate must be in the format of YYYY-MM-DD.',
  }),
});

// Export the validation function
const validateMutualFund = (mutualFund) => {
  return mutualFundSchema.validate(mutualFund);
};

module.exports = {
  validateMutualFund,
};
