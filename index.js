const { connectDB } = require('./config/db')
const express = require('express')
const cors = require("cors");
const routes = require('./routes/index')

const app = express();

connectDB()


//cors configuration
var corsOptions = {
    origin: process.env.client_url
  };
  
app.use(cors(corsOptions));



//request parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//route setup
app.use('/', routes)






app.listen(process.env.PORT, () =>{
    console.log(`listening to port ${process.env.PORT}`)
})