const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');


const BankDetail = sequelize.define('BankDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bank_name: DataTypes.STRING,
    bank_account_number: DataTypes.INTEGER,
    bvn: DataTypes.INTEGER,
},
  {
  timestamps: true,
  // tableName: 'BankDetail'
});

module.exports = BankDetail;