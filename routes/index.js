const express = require('express')
const sellerRoute = require('./sellerRoute');
const buyerRoute = require('./BuyerRoute');
const productRoute = require('./productRoute');

const router = express.Router();

router.use('/seller', sellerRoute);
router.use('/buyer', buyerRoute);;
router.use('/', productRoute)


module.exports = router;