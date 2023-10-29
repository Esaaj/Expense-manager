const Joi = require('joi');
const { accountType } = require('../helpers/enum');

const accountSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': 'Name must be a string.',
  }),
  type: Joi.string().valid(...accountType).required().messages({
    'any.required': 'Account type is required.',
    'string.base': 'Account type must be a string.',
    'any.only': 'Invalid account type.',
  }),
});

const validateAccount = (account) => {
  return accountSchema.validate(account);
};

module.exports = {
  validateAccount,
};
