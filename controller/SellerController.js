const Seller = require('../models/Seller')
const jwt = require('jsonwebtoken');
const twilioClient = require('../config/twilioConfig')
const bcrypt = require('bcrypt');
const { where } = require('sequelize');




exports.createSeller = async(req, res) =>{
  const salt = await bcrypt.genSalt();
    try{
        const seller  = await Seller.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone_number: req.body.phone_number
        });
        
          await twilioClient.verify.v2.services(process.env.TWILIO_ServiceId)
                .verifications
                .create({to: req.body.phone_number, channel: 'sms'})
          // const otpResponse = JSON.stringify(otp);
        res.status(200).json({success: true, data: {...seller}})
    }catch(err){
        res.status(400).json({success: false, message: err.message})

    }
}

exports.verifySeller = async(req, res) =>{
  const { phone_number, otp } = req.body;
  const seller = await Seller.findOne({ where: { phone_number: phone_number } });

  try {
    const verifiedResponse = await twilioClient.verify.v2.
      services(process.env.TWILIO_ServiceId)
      .verificationChecks.create({
        to: phone_number,
        code: otp,
      })
      
        const updatedSeller = await Seller.update({isVerified: true},{where: {id: seller.id}} );
        return res.status(200).json({success: true, data: 'OTP verified successfully'});
      
  } catch (error) {
      res.status(error?.status || 400).send(error?.message || 'Something went wrong');
  }
}

exports.login = async (req,res) => {
  const seller = await Seller.findOne({ where: {email: req.body.email}})
  const secret = process.env.SECRET;
  if(!seller) {
      return res.status(400).send('The user not found');
  }
  if(!seller.isVerified){
    return res.status(400).json({success: false, data: 'User has not been verified'})
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
}