const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const BankDetail = require('./BankDetail');
const AgrikoUser = require('./ArigkoUser');
const Address = require('./Address');
const BusinessInfo = require('./BusinessInfo');

class Seller extends AgrikoUser{
  
}

Seller.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
},
  {
    timestamps: true,
    sequelize,
    modelName: 'Seller'
  });
Seller.hasOne(BusinessInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
BusinessInfo.belongsTo(Seller);
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