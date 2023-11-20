const { Seller } = require('../models/index')
const httpStatus = require('http-status')
const { twilioClient, sendOTP, verifyOTP } = require('../config/twilioConfig')
const { where } = require('sequelize');
const { registerSellerValidationSchema, loginValidationSchema, 
  verifyEmail, verifyPhoneNumber, 
  tokenSchema, passwordSchema, bankDetailSchema,
  businessInfoSchema, directorDetailSchema
 } = require('../validations/index');
const { generateToken, encryptPassword, decryptPassword } = require('../config/token')
const ApiError = require('../config/ApiError');
const AgrikoUser = require('../models/AgrikoUser');
const { sendResetPasswordEmail } = require('../config/mailConfig');
const Token = require('../models/Token');
const crypto = require('crypto');
const BusinessInfo = require('../models/BusinessInfo');
const DirectorDetail = require('../models/DirectorDetail');
const BankDetail = require('../models/BankDetail');




//Seller sign up

exports.createSeller = async(req, res) =>{
  
    try{
      const { error } = await registerSellerValidationSchema.validateAsync(req.body);
      if(error){
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      }
      const hashPassword = await encryptPassword(req.body.password)
      const agrikoUser = await AgrikoUser.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      })
        const seller  = await Seller.create({
            email: req.body.email,
            hasPassword: true,
            password: hashPassword,
            phone_number: req.body.phone_number,    
        });
        seller.setAgrikoUser(agrikoUser);
      const agrikoUserData = await seller.getAgrikoUser();

      const responseObject = {
        id: seller.id,
        firstname: agrikoUserData.firstname,
        lastname: agrikoUserData.lastname,
        email: seller.email,
        phone_number: seller.phone_number
      }

      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'Seller created successfully',
        data: responseObject
      });
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
    const seller = req.user;
    await sendOTP(seller.phone_number, 'sms');
    res.status(httpStatus.OK).json({success: true, message: `Otp sent to ${seller.phone_number}`})
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: error?.message})
  }  
}

//send OTP to email

exports.sendEmailOtp = async (req, res) => {
  try {
    const seller = req.user;

    await sendOTP(seller.email, 'email');
    res.status(httpStatus.OK).json({ success: true, message: `Otp sent to ${email}` })
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error?.message })
  }
}

//verify OTP

exports.verifySellerPhoneNumber = async(req, res) =>{
  const seller = req.user;
  const otp = req.body.token;

  try {
    const verifiedResponse = await verifyOTP(seller.phone_number, otp);
        if (verifiedResponse.status === "approved") {
          await seller.update({ phoneVerified: true }, { where: { id: seller.id } });
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
  const { user, body: { otp, email } } = req;
  const seller = user;
  

  try {
    if (seller.email != email) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${email} not registered by user`);
    }
    const verifiedResponse = verifyOTP(email, otp);
    if (verifiedResponse.status === "approved") {
      await seller.update({ emailVerified: true });
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
      if(!seller) {
        throw new ApiError(httpStatus.UNAUTHORIZED, `user with ${req.body.email} does not exist`)
      }
      if (seller.getAgrikoUser.signUpType === 'social') {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({status: false, message: 'User has not set up password'});
      }
    decPass = await decryptPassword(req.body.password, seller.password);
    if (seller && decPass) {
          const token = generateToken(seller.id, seller.role);
          if(!token){
            throw new ApiError(httpStatus.BAD_GATEWAY, 'Token could not be generated')
          }
        
          res.status(httpStatus.OK).json({success: true, user: seller.email , token: token}) 
      } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'password is wrong!');
      }
  } catch (error) {
    res.status(error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send(error?.message || 'Something went wrong');
  }
}

//logout
exports.signout = (req, res, next) => {
  try{
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });


    res.status(httpStatus.OK).json({ success: true, message: 'log out successfully' });
  
  }
   catch (error) {
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
    const user = await Seller.findOne({ where: { email: email } })
    if(user.emailVerified ===false){
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
      const err = await passwordSchema.validateAsync(newPassword).error;
      if (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, err.message);
      }
      const tokenObject = await Token.findOne({ token })
      if(!tokenObject){
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Token does not exist')
      }
      if(Date.now() > tokenObject.expiredAt){
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
      const { error } = await verifyPhoneNumber.validateAsync(phone_number);
      
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      }
      
      const seller = await Seller.findOne({ where: { phone_number: phone_number } })
      if(!seller){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number does not exist')
      }
      if (seller.phoneVerified === false) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number not verified')
      }  
      const twilioRes = await sendOTP(phone_number, 'sms');
      console.log(twilioRes)

      if (twilioRes.status === 403) {
        throw new ApiError(httpStatus.BAD_REQUEST, twilioRes.details)
      }

      res.status(httpStatus.OK).json({ success: true, message: `Otp sent to ${phone_number}` })
      } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }
  } 


//forgot password with phone OTP verification
exports.verifyForgotPasswordByPhoneOTP = async (req, res) => {
    const {password, phone_number} = req.body;
    const otp = req.params.token;
    try {
      const verifiedResponse = verifyOTP(phone_number, otp);
      if (verifiedResponse.status === "approved") {
        await Seller.update({ password: encryptPassword(password) }, { where: { phone_number: phone_number } });
        return res.status(httpStatus.OK).json({ success: true, message: "Password change successfully" });
      }
    } catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }
  }
    
  
//edit profile

exports.editSellerProfile = async(req, res) =>{
    try {
          const seller = req.user;
          if(!seller.isProfileUpdated){
            throw new ApiError(httpStatus.BAD_REQUEST, 'User profile has not been updated')
          }
          const businessInfo = await seller.getBusinessInfo();

          if(req.body.business_info){
              const { error } = await businessInfoSchema.validateAsync(req.body.business_info);
              if (error) {
                throw new ApiError(httpStatus.BAD_REQUEST, error.message)
              }
              if (businessInfo) {
                await businessInfo.update(req.body.business_info);
              } 
          }

          const directorInfo = await seller.getDirectorDetail();
          
          if (req.body.director_detail) {
            const { error } = await directorDetailSchema.validateAsync(req.body.director_detail);
            if (error) {
              throw new ApiError(httpStatus.BAD_REQUEST, error.message)
            }
            if (directorInfo) {
              await directorInfo.update(req.body.director_detail);
            } 
          
            res.status(httpStatus.OK).json({
              success: true, message: 'Profile updated successfully', data: {
                seller: seller.toJSON(),

                businessInfo: businessInfo ? businessInfo.toJSON() : null,
                directorDetail: directorInfo ? directorInfo.toJSON() : null,
              },
            });
        }
      }
    catch (error) {
      res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
    }
  }
//Seller update
exports.updateSellerProfile = async (req, res) => {
  let bankInfo;
  let bizInfo;
  let directorInfo;
  try {
    const seller = req.user;
    if (req.body.business_info) {
      const { error } = await businessInfoSchema.validateAsync(req.body.business_info);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      let businessDetail = req.body.business_info;
      bizInfo = await BusinessInfo.create({
        business_name: businessDetail.business_name,
        business_description: businessDetail.business_description,
        incorporation_doc: businessDetail.incorporation_doc,
        SellerId: seller.id
      });
      // await seller.setBusinessInfo(bizInfo);
    }
    if (req.body.director_detail) {
      const { error } = await directorDetailSchema.validateAsync(req.body.director_detail);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      let directorDetail = req.body.director_detail;
      directorInfo = await DirectorDetail.create({
        fullname: directorDetail.fullname,
        phone_number: directorDetail.phone_number,
        identification_doc: directorDetail.identification_doc,
        SellerId: seller.id
      });
      // await seller.setDirectorDetail(directorInfo);
    }
    if (req.body.bank_detail) {
      const { error } = await bankDetailSchema.validateAsync(req.body.bank_detail);
      if (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
      }
      let bankDetail = req.body.bank_detail;
      bankInfo = await BankDetail.create({
        bank_name: bankDetail.bank_name,
        bank_account_number: bankDetail.bank_account_number,
        bvn: bankDetail.bvn,
        SellerId: seller.id,
      });
      
    }
    await seller.update({isProfileUpdated: true})
      res.status(httpStatus.OK).json({ success: true, message: 'Profile updated successfully', data:{
        seller: seller.toJSON(),
        
        businessInfo: bizInfo ? bizInfo.toJSON() : null,
        bankDetail: bankInfo ? bankInfo.toJSON() : null,
        directorDetail: directorInfo ? directorInfo.toJSON() : null,
      }, });
  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}

exports.enable2FA = async(req, res) =>{
  try {
    const seller = req.user;
    if(req.params.phone_number){
      phone_number = req.params.phone_number;
      if(phone_number != seller.phone_number){
        throw new ApiError(httpStatus.BAD_REQUEST, `${phone_number} is not registered by seller`);
      }
      if(seller.getAgrikoUser.phoneVerified == false){
        throw new ApiError(httpStatus.BAD_REQUEST, `${phone_number} is not verified by seller`);
      }
      sendOTP(phone_number, 'sms');
    }


    if (req.params.email) {
      email = req.params.email;
      if (email != seller.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${email} is not registered by seller`);
      }
      if (seller.getAgrikoUser.emailVerified == false) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${email} is not verified by seller`);
      }
      sendOTP(email, 'email');
    }
    res.status(httpStatus.OK).json({success: true, message: '2FA verification sent successfully'});
  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}

exports.confirmEnable2FA = async(req, res) =>{

  try {
    if(req.body.phone_number){
      verifyOTP(req.body.phone_number, 'sms')
    }
    if(req.body.email){
      verifyOTP(req.body.email, 'email');
    }
    const seller = req.user;
    await seller.getAgrikoUser.update({ enable2FA: true });
    res.status(httpStatus.OK).json({success: true, message: '2FA activated successfully'})
  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }

}
exports.disable2FA = async (req, res) =>{
  try {
    const seller = req.user;
    seller.getAgrikoUser.update({enable2FA: false});
    res.status(httpStatus.OK).json({ success: true, message: '2FA deactivated successfully' })
  } catch (error) {
    res.status(error?.statusCode || httpStatus.BAD_REQUEST).send(error?.message || 'Something went wrong');
  }
}