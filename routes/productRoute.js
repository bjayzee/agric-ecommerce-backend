const express = require('express')
const router = express.Router();
const productController = require('../controller/ProductController')

const { auth } = require('../middleware/passport');


router.post('/category', auth, productController.createCategory);
router.post('/product', auth, productController.createProduct);
router.put('/product/edit', auth, productController.editProduct);
router.get('/seller/products', auth, productController.listAllProductBySeller);
router.get('/seller/products/search', auth, productController.searchProduct);



module.exports = router;