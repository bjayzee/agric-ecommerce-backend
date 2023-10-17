const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');


const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    street: DataTypes.STRING,
    lga: DataTypes.TEXT,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
  }, 
    {
    timestamps: true,
    // tableName: 'Address'
  },
);

module.exports = Address;