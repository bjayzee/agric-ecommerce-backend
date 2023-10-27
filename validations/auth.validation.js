const Joi = require('joi');

const registerSellerValidationSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    phone_number: Joi.string()
      .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      .message('Phone number must be a valid international phone number')
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .min(8)
      .message('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character')
      .required(),
  });

const loginValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const verifyPhoneNumber = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  registerSellerValidationSchema,
  loginValidationSchema,
  verifyPhoneNumber,
  verifyEmail,
};
