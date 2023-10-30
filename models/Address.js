const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');


const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    address_type: {
      type: DataTypes.ENUM,
      values: ['general', 'business']
    },
    street: DataTypes.STRING,
    lga: DataTypes.TEXT,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
  }, 
    {
    timestamps: false,
  },
);

module.exports = Address;