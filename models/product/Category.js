const { sequelize, DataTypes, Model } = require('../../config/db');

class Category extends Model {

}
Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: DataTypes.STRING,
},
    {
        timestamps: true,
        sequelize,
        modelName: 'Category',
        raw: false
    },
);

module.exports = Category;