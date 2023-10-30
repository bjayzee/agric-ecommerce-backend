const { sequelize } = require('../config/db');
const { DataTypes, Model } = require('sequelize');


class AgrikoUser extends Model{}
AgrikoUser.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    phone_number: DataTypes.STRING,
},{
  timestamps: false,
  sequelize,
  modelName: 'AgrikoUser'
});

module.exports = AgrikoUser;
