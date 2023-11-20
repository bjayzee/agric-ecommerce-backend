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
    email: {
        type: DataTypes.STRING,
        unique: {
            msg: 'Email already in use'
        },
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
    },
    hasPassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: {
            msg: 'Phone number is attached to another user'
        },
    },
    token: DataTypes.STRING
},
    {
        timestamps: true,
        sequelize,
        modelName: 'Buyer',
        raw: false
    });
Buyer.belongsTo(AgrikoUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Address.belongsTo(Buyer);
Buyer.hasMany(Address)



module.exports = Buyer;