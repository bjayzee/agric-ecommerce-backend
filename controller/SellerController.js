const Seller = require('../models/Seller')
const httpStatus = require('http-status')
const jwt = require('jsonwebtoken');
const twilioClient = require('../config/twilioConfig')
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { registerSeller, login, 
  verifyEmail, verifyPhoneNumber} = require('../validations/index');



//Seller sign up

exports.createSeller = async(req, res) =>{
  const salt = await bcrypt.genSalt();
    try{

      const { error } = await registerSeller.validateAsync(req.body);
      if(error){
        return res.status(httpStatus.BAD_REQUEST).json({success: false, message: error.details[0].message})
      }
        const seller  = await Seller.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone_number: req.body.phone_number
        });
        res.status(200).json({success: true, data: {...seller}})
    }catch(err){
        res.status(400).json({success: false, message: err.message})

    }
}

// Find Seller by id

const findSellerById = async(id) =>{
  const seller = await Seller.findOne({ id })
  if(!seller){
    return new Error('User does not exist') 
  }
  return seller;
}

//send OTP to phone number
exports.sendPhoneOtp = async (req, res) =>{
  try {
    const seller = findSellerById(req.body.id);
  
    await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
                .verifications
                .create({to: seller.phone_number, channel: 'sms'})
    res.status(200).json({success: true, data: `Otp sent to ${seller.phone_number}`})
  } catch (error) {
    res.status(error?.status).json({success: false, data: error?.message})
  }  
}

exports.verifySeller = async(req, res) =>{
  const { phone_number, otp, id } = req.body;

  try {
    const seller = findSellerById(id)
    if(!seller.phone_number === phone_number){
      res.status(400).json({success: false, data: `This phone number ${phone_number} is not registered with this user`})
    }
    const verifiedResponse = await twilioClient.verify.v2.
      services(process.env.TWILIO_ServiceId)
      .verificationChecks.create({
        to: phone_number,
        code: otp,
      })
        if (verifiedResponse.status === "approved") {
          await Seller.update({ phoneVerified: true }, { where: { id: seller.id } });
          return res.status(200).json({ success: true, data: "OTP verified successfully" });
        } else {
          return res.status(400).json({ success: false, data: "OTP verification failed" });
        }
      
  } catch (error) {
      res.status(error?.status || 400).send(error?.message || 'Something went wrong');
  }
}

exports.login = async (req,res) => {
  try {
      const seller = await Seller.findOne({ where: {email: req.body.email}})
      const secret = process.env.SECRET;
      if(!seller) {
          return res.status(404).send('user not found');
      }
      if(seller && bcrypt.compareSync(req.body.password, seller.password)) {
          const token = jwt.sign(
              {
                  sellerId: seller.id,
                  role: seller.role
              },
              secret,
              {expiresIn : '1d'}
          )
        
          res.status(200).json({success: false, user: seller.email , token: token}) 
      } else {
        res.status(400).send('password is wrong!');
      }
  } catch (error) {
    res.status(error?.status || 400).send(error?.message);
  }
}