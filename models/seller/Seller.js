const { sequelize, DataTypes, Model } = require('../../config/db');
const BankDetail = require('../BankDetail');
const AgrikoUser = require('../AgrikoUser');
const Address = require('../Address');
const BusinessInfo = require('../BusinessInfo');
const DirectorDetail = require('../DirectorDetail');
const Product = require('../product/Product')

class Seller extends Model {

}

Seller.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'seller'
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
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    unique: {
      msg: 'Phone number is attached to another user'
    },
    allowNull: false,
  },
  isProfileUpdated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: DataTypes.STRING
},
  {
    timestamps: true,
    sequelize,
    modelName: 'Seller',
    raw: false
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

Seller.hasOne(DirectorDetail, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
DirectorDetail.belongsTo(Seller);

Seller.hasMany(Address, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Seller.hasMany(Product, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Product.belongsTo(Seller);
Address.belongsTo(Seller);

Seller.belongsTo(AgrikoUser, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


module.exports = Seller;