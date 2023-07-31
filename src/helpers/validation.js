const Joi = require('joi');

const productSchema = Joi.object({
    code: Joi.string().required().max(20).messages({
      'string.base': `code must be a type of string`,
      'string.empty': `code is required`,
      'string.min': `code must have minimum of {#limit} characters`,
      'string.max': `code can have maximum of {#limit} characters`,
      'any.required': `code is required`,
      'any.optional': `code is optional`,
    }),
    name: Joi.string().required().max(40).messages({
      'string.base': `name must be a type of string`,
      'string.empty': `name is required`,
      'string.min': `name must have minimum of {#limit} characters`,
      'string.max': `name can have maximum of {#limit} characters`,
      'any.required': `name is required`,
      'any.optional': `name is optional`,
    }),
    price: Joi.number().required().messages({
      'string.base': `price must be a type of number`,
      'string.empty': `price is required`,
      'string.min': `price must have minimum of {#limit} characters`,
      'string.max': `price can have maximum of {#limit} characters`,
      'any.required': `price is required`,
    }),
    isCylinder: Joi.boolean().required().valid(true, false).messages({
        'boolean.base': 'isCylinder must be a boolean',
    }),
});

const validateProductData = (data) => {
    return productSchema.validate(data);
};

module.exports = {
    validateProductData
}
  