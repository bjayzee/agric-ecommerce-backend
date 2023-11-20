require('dotenv').config()

const { Sequelize, Model, DataTypes } = require("sequelize");


  const sequelize = new Sequelize(process.env.DB_URL, {
    define: {
      freezeTableName: true
    }})

  const connectDB = async () => {
    console.log('Checking database connection...');
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      await sequelize.sync({force: false})
    } catch (e) {
      console.log('Database connection failed', e);
      process.exit(1);
    }
  };


module.exports = {connectDB, sequelize, Model, DataTypes};