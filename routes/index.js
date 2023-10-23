const express = require('express')

const router = express.Router();

router.use('/seller', require('./sellerRoute'))


module.exports = router;