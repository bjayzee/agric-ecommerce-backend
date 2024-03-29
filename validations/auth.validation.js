const Joi = require('joi');


const seller_infoValidationSchema = Joi.object().keys({
  email: Joi.string().required().email().message('Invalid email'),
  firstname: Joi.string().min(3).max(30).required(),
  lastname: Joi.string().min(3).max(30).required()
    .required(),
});


const registerSellerValidationSchema = Joi.object().keys({
    email: Joi.string().required().email().message('Invalid email'),
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    phone_number: Joi.string()
      .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
      .message('Phone number must be a valid international phone number')
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .message('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character')
      .min(8)
      .message('Password can not be less than 8 characters')
      .required(),
  });

const loginValidationSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

const verifyEmail = Joi.string().required().email();

const tokenSchema = Joi.string().hex().length(64);

const passwordSchema =Joi.string()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
  .message('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character')
  .min(8)
  .message('Password can not be less than 8 characters')
  .required()



const verifyPhoneNumber = Joi.string()
  .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
  .message('Phone number must be a valid international phone number')
  .required();

const businessInfoSchema = Joi.object({
  business_name: Joi.string().max(255).required(),
  business_description: Joi.string().max(500).required(),
  incorporation_doc: Joi.string().max(255).required(),
});

const directorDetailSchema = Joi.object({
  fullname: Joi.string().max(255).required(),
  phone_number: Joi.string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
    .message('Phone number must be a valid international phone number')
    .required(),
  identification_doc: Joi.string().max(255).required(),
});

const bankDetailSchema = Joi.object({
  bank_name: Joi.string().max(255).required(),
  bank_account_number: Joi.string().required(),
  bvn: Joi.string().required()
});
const addressSchema = Joi.object({
  address_type: Joi.string().valid('general', 'business').required(),
  street: Joi.string().max(255).required(),
  lga: Joi.string().max(500).required(),
  state: Joi.string().max(255).required(),
  country: Joi.string().max(255).required(),
});

module.exports = {
  registerSellerValidationSchema,
  loginValidationSchema,
  verifyPhoneNumber,
  verifyEmail,
  tokenSchema,
  passwordSchema,
  businessInfoSchema,
  directorDetailSchema,
  bankDetailSchema,
  addressSchema,
  seller_infoValidationSchema
};
