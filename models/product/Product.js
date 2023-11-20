const { sequelize, DataTypes, Model } = require('../../config/db');
const Seller = require('../seller/Seller');
const Category = require('./Category');
const Review = require('./Review');

class Product extends Model { }

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING), 
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        numLeftInStock: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        timestamps: true,
        modelName: 'Product',
    }
);

Product.belongsTo(Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Product.hasMany(Review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Review.belongsTo(Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


module.exports = Product;