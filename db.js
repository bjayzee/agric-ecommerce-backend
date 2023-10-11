require('dotenv').config()

const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize('postgres://dev:pass@example.com:5432/dbname')


const sequelize = new Sequelize('agriko', process.env.DB_USERNAME, process.env.DB_PASSCODE, {
    host: 'localhost',
    dialect: 'postgres',
  });


module.exports = sequelize;