const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    images: Joi.array().items(Joi.string()), 
    quantity: Joi.number().integer(), 
});



module.exports = {
    productSchema,
}