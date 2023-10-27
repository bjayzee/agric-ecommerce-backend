const { connectDB } = require('./config/db')
const express = require('express')
const cors = require("cors");
const routes = require('./routes/index')
const passport = require('passport')
const jwtStrategy = require('./middleware/passport')

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


//middleware
app.use(passport.initialize())
passport.use('jwt', jwtStrategy);


//route setup
app.use('/v1', routes)






app.listen(process.env.PORT, () =>{
    console.log(`listening to port ${process.env.PORT}`)
})