const Joi = require('joi');

const budgetSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name must be a string.',
        'any.required': 'Name is required.',
    }),
    limitAmount: Joi.number().min(0).required().messages({
        'number.base': 'Limit amount must be a number.',
        'number.min': 'Limit amount cannot be negative.',
        'any.required': 'Limit amount is required.',
    }),
    startDate: Joi.string().isoDate().required().messages({
        'string.base': 'Start date must be a string.',
        'string.isoDate': 'Invalid date format for start date.',
        'any.required': 'Start date is required.',
    }),
    endDate: Joi.string().isoDate().required().messages({
        'string.base': 'End date must be a string.',
        'string.isoDate': 'Invalid date format for end date.',
        'any.required': 'End date is required.',
    }),
});

const validateBudget = (budget) => {
    return budgetSchema.validate(budget);
};

module.exports = {
    validateBudget,
};
