const { sequelize, DataTypes } = require('../config/db');

const BankDetail = sequelize.define('BankDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: {
        type: false,
        msg: 'Bank name cannot be empty',
      }
    
    },
  bank_account_number: {
    type: DataTypes.STRING,
    allowNull: {
      type: false,
      msg: 'Bank name cannot be empty',
    }

  },
  bvn: {
    type: DataTypes.STRING,
    allowNull: {
      type: false,
      msg: 'BVN cannot be empty',
    }

  },
},
  {
  timestamps: true,
});

module.exports = BankDetail;