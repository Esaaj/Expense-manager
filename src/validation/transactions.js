const Joi = require('joi');
const { transactionsType } = require('../helpers/enum');

const transactionSchema = Joi.object().keys({
  type: Joi.string()
    .valid(...transactionsType)
    .required()
    .messages({
      'any.required': 'Transaction type is required.',
      'string.base': 'Transaction type must be a string.',
      'any.only': 'Invalid transaction type.',
    }),
  description: Joi.string().messages({
    'string.base': 'Description must be a string.',
  }),
  amount: Joi.number().messages({
    'number.base': 'Amount must be a number.',
  }),
  date: Joi.date().iso().messages({
    'date.base': 'Date must be a valid date string.',
    'date.format': 'Date must be in the format of YYYY-MM-DD.',
    'date.format': 'Date must be in the format of YYYY-MM-DD.',
  }),
}).when(Joi.object({ type: 'transfer' }), {
  then: Joi.object({
    fromAccountId: Joi.string().required().messages({
      'any.required': 'From Account ID is required for transfers.',
      'string.base': 'From Account ID must be a string.',
    }),
    toAccountId: Joi.string().required().messages({
      'any.required': 'To Account ID is required for transfers.',
      'string.base': 'To Account ID must be a string.',
    }),
  }),
  otherwise: Joi.object({
    accountId: Joi.string().required().messages({
      'any.required': 'Account ID is required.',
      'string.base': 'Account ID must be a string.',
    }),
    category: Joi.string().messages({
      'string.base': 'Category must be a string.',
    }),
  })
});

const validateTransaction = (transaction) => {
  return transactionSchema.validate(transaction);
};

module.exports = {
  validateTransaction,
};
