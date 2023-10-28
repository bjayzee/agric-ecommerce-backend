const Seller = require('../models/Seller')
const httpStatus = require('http-status')
const twilioClient = require('../config/twilioConfig')
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { registerSellerValidationSchema, loginValidationSchema, 
  verifyEmail, verifyPhoneNumber} = require('../validations/index');
const { generateToken } = require('../config/token')
const ApiError = require('../config/ApiError')




//Seller sign up

exports.createSeller = async(req, res) =>{
  const salt = await bcrypt.genSalt();
    try{
      const { error } = await registerSellerValidationSchema.validateAsync(req.body);
      if(error){
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      }
        const seller  = await Seller.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone_number: req.body.phone_number
        });
        const {password, ...response} = seller;
        res.status(httpStatus.CREATED).json({success: true, data: {...response}})
    }catch(err){
        res.status(err?.statusCode).json({success: false, message: err?.message})
    }
}

// Find Seller by id

const findSellerById = async(id) =>{
  const seller = await Seller.findByPk({ id })
  if(!seller){
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  return seller;
}

//send OTP to phone number
exports.sendPhoneOtp = async (req, res) =>{
  try {
    if (!req.isAuthenticated()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'user not aunthenticated');
    }
    const { phone_number, id } = req.user;
  
    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
                .verifications
                .create({to: phone_number, channel: 'sms'})
    res.status(httpStatus.OK).json({success: true, message: `Otp sent to ${phone_number}`})
  } catch (error) {
    res.status(error?.statusCode).json({success: false, message: error?.message})
  }  
}

//send OTP to email

exports.sendEmailOtp = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'user not aunthenticated');
    }
    const { email, id } = req.user;

    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
      .verifications
      .create({ to: email, channel: 'email' })
    res.status(httpStatus.OK).json({ success: true, message: `Otp sent to ${email}` })
  } catch (error) {
    res.status(error?.statusCode).json({ success: false, message: error?.message })
  }
}

//verify OTP

exports.verifySellerPhoneNumber = async(req, res) =>{
  if(!req.isAuthenticated()){
    throw new ApiError(httpStatus.FORBIDDEN, 'user not aunthenticated');
  }
  const { phone_number, id } = req.user;

  try {
    const verifiedResponse = await twilioClient.verify.v2.
      services(process.env.TWILIO_ServiceId)
      .verificationChecks.create({
        to: phone_number,
        code: otp,
      })
        if (verifiedResponse.status === "approved") {
          await Seller.update({ phoneVerified: true }, { where: { id: id } });
          return res.status(httpStatus.OK).json({ success: true, message: "OTP verified successfully" });
        } else {
          return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: "OTP verification failed" });
        }
  } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}

//verify OTP to Email
exports.verifySellerEmail = async (req, res) => {

  if (!req.isAuthenticated()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'user not aunthenticated');
  }
  const { phone_number, id } = req.user;

  try {
    const seller = findSellerById(id)
    if (!seller.email === email) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${email} not registered by user`);
    }
    const verifiedResponse = await twilioClient.verify.v2.
      services(process.env.TWILIO_ServiceId)
      .verificationChecks.create({
        to: email,
        code: otp,
      })
    if (verifiedResponse.status === "approved") {
      await Seller.update({ emailVerified: true }, { where: { id: seller.id } });
      return res.status(httpStatus.OK).json({ success: true, message: "Email verified successfully" });
    } else {
      return res.status(httpStatus.BAD_GATEWAY).json({ success: false, message: "Email verification failed" });
    }

  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_GATEWAY).send(error?.message || 'Something went wrong');
  }
}

//login

exports.login = async (req,res) => {
  try {
      const { error } = await loginValidationSchema.validateAsync(req.body);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      const seller = await Seller.findOne({ where: {email: req.body.email}})
      const secret = process.env.SECRET;
      if(!seller) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `user with ${req.body.email} does not exist`)
      }
      if(seller && bcrypt.compareSync(req.body.password, seller.password)) {
          const token = generateToken(seller.id, seller.role);
          if(!token){
            throw new ApiError(httpStatus.BAD_GATEWAY, 'Token could not be generated')
          }
        
          res.status(httpStatus.OK).json({success: false, user: seller.email , token: token}) 
      } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'password is wrong!');
      }
  } catch (error) {
    res.status(error?.statusCode).send(error?.message);
  }
}