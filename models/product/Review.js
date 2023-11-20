const { sequelize, DataTypes, Model } = require('../../config/db');

class Review extends Model {

}
Review.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ratings: DataTypes.DECIMAL
},
    {
        timestamps: true,
        sequelize,
        modelName: 'Review',
        raw: false
    },
);

module.exports = Review;