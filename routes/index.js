const express = require('express')
const sellerRoute = require('./sellerRoute');
const buyerRoute = require('./BuyerRoute');


const router = express.Router();

router.use('/seller', sellerRoute)
router.use('/buyer', buyerRoute)


module.exports = router;