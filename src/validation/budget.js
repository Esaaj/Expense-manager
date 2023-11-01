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
    startDate: Joi.date().iso().messages({
        'date.base': 'startDate must be a valid date string.',
        'date.format': 'startDate must be in the format of YYYY-MM-DD.',
        'date.format': 'startDate must be in the format of YYYY-MM-DD.',
    }),
    endDate: Joi.date().iso().messages({
        'date.base': 'startDate must be a valid date string.',
        'date.format': 'startDate must be in the format of YYYY-MM-DD.',
        'date.format': 'startDate must be in the format of YYYY-MM-DD.',
    })
});

const validateBudget = (budget) => {
    return budgetSchema.validate(budget);
};

module.exports = {
    validateBudget,
};
