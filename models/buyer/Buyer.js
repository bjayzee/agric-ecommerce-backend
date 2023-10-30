const { sequelize } = require('../config/db');
const { DataTypes, Model } = require('sequelize');


class Buyer extends Model {

}

Buyer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'buyer'
    },
    isProfileUpdated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},
    {
        timestamps: true,
        sequelize,
        modelName: 'Buyer',
        raw: false
    });

Buyer.hasMany(Address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Address.belongsTo(Buyer);

Buyer.belongsTo(AgrikoUser);


module.exports = Buyer;