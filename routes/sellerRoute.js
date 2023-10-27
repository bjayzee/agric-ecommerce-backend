const express = require('express')
const router = express.Router();
const sellerController = require('../controller/SellerController')
const passport = require('passport')

const auth = passport.authenticate('jwt', {session: false})

router.post('/', sellerController.createSeller);
router.post('/verify/phone', auth, sellerController.verifySellerPhoneNumber);
router.post('/verify/email', auth, sellerController.verifySellerEmail);
router.post('/auth', sellerController.login);
route.post('email/otp', auth, sellerController.sendEmailOtp)
route.post('phone/otp', auth, sellerController.sendPhoneOtp)


module.exports = router;