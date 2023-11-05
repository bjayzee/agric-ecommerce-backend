const { sequelize, DataTypes } = require("../config/db");


const BusinessInfo = sequelize.define('BusinessInfo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    business_name: DataTypes.STRING,
    business_description: DataTypes.STRING,
    incorporation_doc: DataTypes.STRING,
},
  {
  timestamps: false,
});

module.exports = BusinessInfo;