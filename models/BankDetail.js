const { sequelize, DataTypes, Model } = require('../config/db');

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
});

module.exports = BankDetail;