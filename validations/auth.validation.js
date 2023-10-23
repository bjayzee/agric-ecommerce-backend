const Joi = require('joi');
const { password } = require('./custom.validation');

const registerSeller = Joi.object().keys({
    email: Joi.string().required().email(),
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    phone_number: Joi.number().integer().min(1000000000).max(9999999999999).required(),
    password: Joi.string().required().custom(password),
  });

const login = {
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
  registerSeller,
  login,
  verifyPhoneNumber,
  verifyEmail,
};
