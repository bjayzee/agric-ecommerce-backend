const express = require('express')
const router = express.Router();
const sellerController = require('../controller/SellerController')
const passport = require('passport')

const auth = passport.authenticate('jwt', {session: false})

router.post('/', sellerController.createSeller);
router.post('/verify/phone', auth, sellerController.verifySellerPhoneNumber);
router.post('/verify/email', auth, sellerController.verifySellerEmail);
router.post('/auth', sellerController.login);
router.post('/email/otp', auth, sellerController.sendEmailOtp)
router.post('/phone/otp', auth, sellerController.sendPhoneOtp)
router.post('/logout', auth, sellerController.signout)
router.post('/forgot-password/email', sellerController.forgotPasswordByEmail)
router.post('/forgot-password/phone', sellerController.forgotPasswordByPhoneOTP)
router.post('/verify-password',  sellerController.verifyForgotPassword)
router.post('/verify-password-OTP', sellerController.verifyForgotPasswordByPhoneOTP)
router.put('/edit-profile', auth, sellerController.editSellerProfile)
router.put('/update-profile', auth, sellerController.updateSellerProfile)



module.exports = router;