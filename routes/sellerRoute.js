const express = require('express')
const router = express.Router();
const sellerController = require('../controller/SellerController')


router.post('/', sellerController.createSeller);
router.post('/verify', sellerController.verifySeller);
router.post('/auth', sellerController.login);


module.exports = router;