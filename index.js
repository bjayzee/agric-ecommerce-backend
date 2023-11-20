require('./config/db').connectDB()
const express = require('express')
const cors = require("cors");
const routes = require('./routes/index');


const app = express();



//cors configuration
const corsOptions = {
    origin: process.env.client_url
  };
  
app.use(cors(corsOptions));



//request parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//middleware
require('./middleware/passport').passport;




//route setup
app.use('/v1', routes);
app.use('/home', (req, res)=>{
  res.send('Welcome home');
})






app.listen(process.env.PORT, () =>{
    console.log(`listening to port ${process.env.PORT}`)
})