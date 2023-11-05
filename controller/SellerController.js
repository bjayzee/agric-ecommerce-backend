const { Seller } = require('../models/index')
const httpStatus = require('http-status')
const twilioClient = require('../config/twilioConfig')
const { where } = require('sequelize');
const { registerSellerValidationSchema, loginValidationSchema, 
  verifyEmail, verifyPhoneNumber, 
  tokenSchema, passwordSchema, bankDetailSchema,
  businessInfoSchema, directorDetailSchema
 } = require('../validations/index');
const { generateToken, encryptPassword } = require('../config/token')
const ApiError = require('../config/ApiError');
const AgrikoUser = require('../models/AgrikoUser');
const { sendResetPasswordEmail } = require('../config/mailConfig');
const Token = require('../models/Token');
const crypto = require('crypto');




//Seller sign up

exports.createSeller = async(req, res) =>{
  
    try{
      const { error } = await registerSellerValidationSchema.validateAsync(req.body);
      if(error){
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      }
        const seller  = await Seller.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: encryptPassword(req.body.password),
            phone_number: req.body.phone_number,
            
        });
        const {password, ...response} = seller;
        res.status(httpStatus.CREATED).json({success: true, data: {...response}})
    }catch(err){
        res.status(err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: err?.message})
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
    const { phone_number, id } = req.user;
  
    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
                .verifications
                .create({to: phone_number, channel: 'sms'})
    res.status(httpStatus.OK).json({success: true, message: `Otp sent to ${phone_number}`})
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error?.message})
  }  
}

//send OTP to email

exports.sendEmailOtp = async (req, res) => {
  try {
    const { email, id } = req.user;

    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
      .verifications
      .create({ to: email, channel: 'email' })
    res.status(httpStatus.OK).json({ success: true, message: `Otp sent to ${email}` })
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error?.message })
  }
}

//verify OTP

exports.verifySellerPhoneNumber = async(req, res) =>{
  const { phone_number, id } = req.user;
  const otp = req.body.token;

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
  const { email, id } = req.user;
  const otp = req.body.token;

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
      return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: "Email verification failed" });
    }

  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}

//login

exports.login = async (req,res) => {
  try {
      const { error } = await loginValidationSchema.validateAsync(req.body);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      const seller = await Seller.findOne({ 
        where: {email: req.body.email},
        include: { model: AgrikoUser }
      
      })
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
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(error?.message || 'Something went wrong');
  }
}

//logout
exports.signout = async(req, res) =>{
  try {
    req.logout();
    res.redirect('/');
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(error?.message || 'Something went wrong');
  }
}


//forgot password by email link
exports.forgotPasswordByEmail = async (req, res) =>{
  const email = req.body.email;

  try {
    const { error } = await verifyEmail.validateAsync(email);
    if (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
    const user = await Seller.findOne({ email })
    if(!user.emailVerified){
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email not verified')
    }
    const token = crypto.randomBytes(32).toString("hex");
    const tokenSchema = await Token.create({
      user_id: user.id,
      token: token
    })
    sendResetPasswordEmail(email, token);
    res.status(httpStatus.OK).json({success: true, message: 'Email sent successfully'});

  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(error?.message || 'Something went wrong');
  }


  //verify reset password

  exports.verifyForgotPassword = async(req, res) =>{
    try {
      const token = req.params.token;
      const { error } = await tokenSchema.validateAsync(token);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      }
      const newPassword = req.body.password;
      const { err } = await passwordSchema.validateAsync(newPassword);
      if (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err.message);
      }
      const tokenObject = await Token.findOne({ token })
      if(!tokenObject){
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Token does not exist')
      }
      if(Date.now > tokenObject.expiredAt){
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Token has expired')
      }
      
      const seller = await Seller.update({password: encryptPassword(newPassword)}, {
        where: {
          id: req.body.id
        }
      });

      res.status(httpStatus.OK).json({success: true, message: 'Password update successfully', data: {...seller}})
    } catch (error) {
      res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(error?.message || 'Something went wrong');
    }
  }

  //forgot password with phone OTP
exports.forgotPasswordByPhoneOTP = async (req, res) => {
    try {
      const phone_number = req.body.phone_number;
      const seller = await Seller.findOne({ phone_number })
      if(!seller){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number does not exist')
      }
      if (seller.phoneVerified === false) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number not verified')
      }  
      await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
        .verifications
        .create({ to: phone_number, channel: 'sms' })
      res.status(httpStatus.OK).json({ success: true, message: `Otp sent to ${phone_number}` })
      } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }
  } 
}

//forgot password with phone OTP verification
exports.verifyForgotPasswordByPhoneOTP = async (req, res) => {
    const {password, phone_number} = req.body;
    const otp = req.params.token;
    try {
      const verifiedResponse = await twilioClient.verify.v2.
        services(process.env.TWILIO_ServiceId)
        .verificationChecks.create({
          to: phone_number,
          code: otp,
        })
      if (verifiedResponse.status === "approved") {
        await Seller.update({ password: encryptPassword(password) }, { where: { phone_number: phone_number } });
        return res.status(httpStatus.OK).json({ success: true, message: "Password change successfully" });
      }
    } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }

    //edit profile

exports.editSellerProfile = async(req, res) =>{
    try {
      const seller = req.user;
      if(req.body.business_info){
        const { error } = await businessInfoSchema.validateAsync(req.body.business_info);
        if (error) {
          throw new ApiError(httpStatus.BAD_REQUEST, error.message)
        }
        await seller.BusinessInfo.update(req.body.business_info)
      }
      if (req.body.director_detail) {
        const { error } = await directorDetailSchema.validateAsync(req.body.director_detail);
        if (error) {
          throw new ApiError(httpStatus.BAD_REQUEST, error.message)
        }
        await seller.DirectorDetail.update(req.body.director_detail)
      }
      res.status(httpStatus.OK).json({ success: true, message: 'Profile updated successfully', data: { ...seller } });
    } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }
  }
} 

//Seller update
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = req.user;
    if (req.body.business_info) {
      const { error } = await businessInfoSchema.validateAsync(req.body.business_info);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      await seller.BusinessInfo.update(req.body.business_info)
    }
    if (req.body.director_detail) {
      const { error } = await directorDetailSchema.validateAsync(req.body.director_detail);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      await seller.DirectorDetail.update(req.body.director_detail)
    }
    if (req.body.bank_detail) {
      const { error } = await bankDetailSchema.validateAsync(req.body.bank_detail);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      await seller.BankDetail.update(req.body.bank_detail)
    }
    await seller.update({isProfileUpdated: true})
    res.status(httpStatus.OK).json({ success: true, message: 'Profile updated successfully', data: { ...seller } });
  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}
