const { connectDB } = require('./config/db')
const express = require('express')
const cors = require("cors");
const sellerRoute = require('./routes/sellerRoute')

const app = express();

connectDB()


//cors configuration
var corsOptions = {
    origin: "http://localhost:3002"
  };
  
app.use(cors(corsOptions));



//request parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//route setup


app.use('/seller', sellerRoute)






app.listen(3002, () =>{
    console.log("listening to port 3002")
})