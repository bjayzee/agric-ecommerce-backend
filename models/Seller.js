const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const BankDetail = require('./BankDetail');
const AgrikoUser = require('./ArigkoUser');
const Address = require('./Address');

const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  password: {
      type: DataTypes.STRING,
      validate: {
          len: {
              args: [8, 255],
              msg: "Field must have a minimum length of 8 characters."
          }
      }
  },
  email: {
      type: DataTypes.STRING,
      unique: {
        args:true,
      msg: 'Email already exist'
    },
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email is not valid'
        }
      }
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'seller'
  },
  gender: DataTypes.STRING,
  date_of_birth: DataTypes.STRING,
  phone_number: DataTypes.STRING,
  business_name: DataTypes.STRING,
  business_description: DataTypes.TEXT,
  director_detail: DataTypes.STRING,
},
  {
    timestamps: true,
  });
Seller.hasMany(BankDetail, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
BankDetail.belongsTo(Seller);

Seller.hasMany(Address,  {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Address.belongsTo(Seller);


module.exports = Seller;