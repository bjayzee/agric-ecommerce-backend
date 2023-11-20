const { sequelize, DataTypes, Model } = require('../config/db');

class AgrikoUser extends Model{}
AgrikoUser.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
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
    enable2FA: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    signUpType: {
    type: DataTypes.ENUM,
    values: ['normal', 'social'],
    defaultValue: 'normal',
  },
},{
  timestamps: false,
  sequelize,
  modelName: 'AgrikoUser'
});

module.exports = AgrikoUser;
