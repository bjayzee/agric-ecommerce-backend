const express = require('express')
const router = express.Router();
const buyerController = require('../controller/BuyerController')
const passport = require('passport')

const auth = passport.authenticate('jwt', { session: false })

router.post('/', buyerController.createBuyer);
router.post('/verify/phone', auth, buyerController.verifyBuyerPhoneNumber);
router.post('/verify/email', auth, buyerController.verifyBuyerEmail);
router.post('/auth', buyerController.login);
router.post('/email/otp', auth, buyerController.sendEmailOtp)
router.post('/phone/otp', auth, buyerController.sendPhoneOtp)
router.post('/logout', auth, buyerController.buyerSignout)
router.post('/forgot-password/email', buyerController.forgotPasswordByEmail)
// router.post('/forgot-password/phone', buyerController.forgotPasswordByPhoneOTP)
// router.post('/verify-password', buyerController.verifyForgotPassword)
router.post('/verify-password-otp', buyerController.verifyForgotPasswordByPhoneOTP)
// router.put('/', buyerController.editBuyerProfile)



module.exports = router;