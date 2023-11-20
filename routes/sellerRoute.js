const express = require('express')
const router = express.Router();
const sellerController = require('../controller/SellerController')

const { auth, googleAuth } = require('../middleware/passport');




router.post('/', sellerController.createSeller);
router.post('/phone/otp', auth, sellerController.sendPhoneOtp)
router.post('/auth', sellerController.login);
router.post('/email/otp', auth, sellerController.sendEmailOtp)
router.post('/verify/phone', auth, sellerController.verifySellerPhoneNumber);
router.post('/verify/email', auth, sellerController.verifySellerEmail);
router.post('/logout', auth, sellerController.signout);
router.post('/forgot-password/email', sellerController.forgotPasswordByEmail);
// **router.post('/verify/forgot-password/email', sellerController.verifyForgotPassword)

router.post('/forgot-password/phone', sellerController.forgotPasswordByPhoneOTP);
router.post('/verify-password-OTP', sellerController.verifyForgotPasswordByPhoneOTP);

router.put('/edit-profile', auth, sellerController.editSellerProfile);

router.get('/:id', ()=>{});

router.get('/auth/google', googleAuth);

router.get('/auth/google/callback',
    googleAuth,
    (req, res) => {
        console.log("first")
        // Redirect to the desired page after successful authentication
        res.redirect('/');
    }
);





router.put('/edit-profile', auth, sellerController.editSellerProfile)
router.put('/update-profile', auth, sellerController.updateSellerProfile)



module.exports = router;