const Joi = require('joi');

// Define the validation schema for Mutual Fund data
const mutualFundSchema = Joi.object({
  fundName: Joi.string().required().messages({
    'string.base': 'Fund name must be a string.',
    'any.required': 'Fund name is required.',
  }),
  fundManager: Joi.string().required().messages({
    'string.base': 'Fund manager must be a string.',
    'any.required': 'Fund manager is required.',
  }),
  nav: Joi.number().min(0).required().messages({
    'number.base': 'NAV (Net Asset Value) must be a number.',
    'number.min': 'NAV cannot be negative.',
    'any.required': 'NAV is required.',
  }),
  investmentAmount: Joi.number().min(0).required().messages({
    'number.base': 'Investment amount must be a number.',
    'number.min': 'Investment amount cannot be negative.',
    'any.required': 'Investment amount is required.',
  }),
  fundType: Joi.string().required().messages({
    'string.base': 'Fund type must be a string.',
    'any.required': 'Fund type is required.',
  }),
  riskLevel: Joi.string().required().messages({
    'string.base': 'Risk level must be a string.',
    'any.required': 'Risk level is required.',
  }),
});

// Export the validation function
const validateMutualFund = (mutualFund) => {
  return mutualFundSchema.validate(mutualFund);
};

module.exports = {
  validateMutualFund,
};
