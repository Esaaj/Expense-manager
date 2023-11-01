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
    billDate: Joi.date().iso().messages({
        'date.base': 'billDate must be a valid date string.',
        'date.format': 'billDate must be in the format of YYYY-MM-DD.',
        'date.format': 'billDate must be in the format of YYYY-MM-DD.',
    }),
    paymentDate: Joi.date().iso().messages({
        'date.base': 'paymentDate must be a valid date string.',
        'date.format': 'paymentDate must be in the format of YYYY-MM-DD.',
        'date.format': 'paymentDate must be in the format of YYYY-MM-DD.',
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
