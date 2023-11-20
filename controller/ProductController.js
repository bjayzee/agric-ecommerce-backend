const {Product, Category} = require('../models/index')
const httpStatus = require('http-status');
const { where, Op } = require('sequelize');
const ApiError = require('../config/ApiError');
const {productSchema} = require('../validations/productValidation')



//Create Category
exports.createCategory = async(req, res) =>{
    try {
        const { error } = await productSchema.validateAsync(req.body);
        if (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
        const category = await Category.create({
            name: req.body.category_name,
            image: req.body.image_url
        })
    } catch (error) {
        res.status(error?.statusCode || httpStatus.BAD_REQUEST).json({ success: false, message: error?.message })
    }
}

// Create Product

exports.createProduct = async(req, res) =>{
    try {
        const { error } = await productSchema.validateAsync(req.body);
        if (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
        if(req.user.role != 'seller'){
            throw new ApiError(httpStatus.FORBIDDEN, 'No right to create product');
        }
        const category = await Category.findOne({ name: req.body.category_name }); 
        if(!category){
            throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
        }
        const product = await Product.create({
            name: req.body.product_name,
            price: req.body.price,
            description: req.body.product_description,
            quantity: req.body.quantity,
            images: req.body.images_url,
            sellerId: req.user.id,
        })
        product.setCategory(category);
       
        
        res.status(httpStatus.OK).json({ success: true, message: 'Product created successfully', data: {...product.toJSON()} });
    } catch (error) {
        res.status(error?.statusCode || httpStatus.BAD_REQUEST).json({ success: false, message: error?.message })
    }
}

//Edit Product

exports.editProduct = async(req, res) =>{
    try {
        if (req.user.role != 'seller') {
            throw new ApiError(httpStatus.FORBIDDEN, 'No right to create product');
        }
        const productId = req.params.productId;
        const product_data = req.body.product_data;
        const updatedProduct = await Product.update(product_data, { where: { id: productId, sellerId: req.user.id }})
        
        res.status(httpStatus.OK).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        res.status(error?.statusCode || httpStatus.BAD_REQUEST).json({ success: false, message: error?.message }) 
    }
}

//List all product
exports.listAllProductBySeller = async(req, res) =>{
    try {
        if (req.user.role != 'seller') {
            throw new ApiError(httpStatus.FORBIDDEN, 'No right to create product');
        }
        const products = await Product.findAll({ where: { sellerId: req.user.id } });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Products listed successfully',
            data: products.map(product => product.toJSON()),
        });
    } catch (error) {
        res.status(error?.statusCode || httpStatus.BAD_REQUEST).json({
            success: false,
            message: error?.message || 'Something went wrong while fetching products',
        });
    }
}
 
exports.searchProduct = async (req, res) =>{
    try {
        if (req.user.role != 'seller') {
            throw new ApiError(httpStatus.FORBIDDEN, 'No right to create product');
        }
        const { name, minPrice, maxPrice, category } = req.query;

        
        const filterConditions = {};
        if (name) {
            filterConditions.name = { [ Op.iLike]: `%${name}%` };
        }
        if (category) {
            filterConditions.category = { [Op.iLike]: `%${category}%` };
        }
        if (minPrice && maxPrice) {
            filterConditions.price = { [Op.between]: [minPrice, maxPrice] };
        } else if (minPrice) {
            filterConditions.price = { [Op.gte]: minPrice };
        } else if (maxPrice) {
            filterConditions.price = { [Op.lte]: maxPrice };
        }
       
        const filteredProducts = await Product.findAll({
            where: { sellerId: req.user.id, ...filterConditions },
        });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Products filtered successfully',
            data: filteredProducts.map(product => product.toJSON()),
        });
    } catch (error) {
        res.status(error?.statusCode || httpStatus.BAD_REQUEST).json({
            success: false,
            message: error?.message || 'Something went wrong while filtering products',
        });
    }
}