const Joi = require('joi');

const creditCardSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name must be a string.',
        'any.required': 'Name is required.',
    }),
    bankName: Joi.string().required().messages({
        'string.base': 'Bank name must be a string.',
        'any.required': 'Bank name is required.',
    }),
    limitAmount: Joi.number().required().messages({
        'number.base': 'Limit amount must be a number.',
        'any.required': 'Limit amount is required.',
    }),
    billDate: Joi.string().required().messages({
        'string.base': 'Bill date must be a string.',
        'any.required': 'Bill date is required.',
    }),
    paymentDate: Joi.string().required().messages({
        'string.base': 'Payment date must be a string.',
        'any.required': 'Payment date is required.',
    }),
    currentOutstanding: Joi.number().required().messages({
        'number.base': 'Current outstanding must be a number.',
        'any.required': 'Current outstanding is required.',
    }),
});

const validateCreditCard = (creditCard) => {
    return creditCardSchema.validate(creditCard);
};

module.exports = {
    validateCreditCard,
};
