const Joi = require('joi');
const { transactionsType } = require('../helpers/enum');

const transactionSchema = Joi.object({
  accountId: Joi.string().required().messages({
    'any.required': 'Account ID is required.',
    'string.base': 'Account ID must be a string.',
  }),
  description: Joi.string().messages({
    'string.base': 'Description must be a string.',
  }),
  category: Joi.string().messages({
    'string.base': 'Category must be a string.',
  }),
  type: Joi.string().valid(...transactionsType).messages({
    'any.required': 'Transaction type is required.',
    'string.base': 'Transaction type must be a string.',
    'any.only': 'Invalid transaction type.',
  }),
  amount: Joi.number().messages({
    'number.base': 'Amount must be a number.',
  }),
  date: Joi.string().messages({
    'string.base': 'Date must be a string.',
  }),
});

const validateTransaction = (transaction) => {
  return transactionSchema.validate(transaction);
};

module.exports = {
  validateTransaction,
};
