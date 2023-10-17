const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');


exports.AgrikoUser = sequelize.define('AgrikoUser', {
    name: DataTypes.STRING,
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
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Email is not valid'
          }
        }
    },
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    phone_number: DataTypes.STRING,
},{
  timestamps: false
})
