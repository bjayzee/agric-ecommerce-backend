const sequelize = require('./db')
const express = require('express')

const app = express()







const connectDB = async () => {
    console.log('Checking database connection...');
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
    } catch (e) {
      console.log('Database connection failed', e);
      process.exit(1);
    }
  };

  connectDB();