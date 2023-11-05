const { sequelize, DataTypes, Model } = require('../config/db');

class Address extends Model {

}
Address.init({
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
    lga: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
  }, 
    {
    timestamps: false,
    sequelize,
    modelName: 'Address',
    raw: false
  },
);

module.exports = Address;