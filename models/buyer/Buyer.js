const { sequelize, DataTypes, Model } = require('../../config/db');
const Address = require('../Address');
const AgrikoUser = require('../AgrikoUser');


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
Buyer.belongsTo(AgrikoUser)
Address.belongsTo(Buyer);
Buyer.hasMany(Address)
module.exports = Buyer;