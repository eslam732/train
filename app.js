require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Routes
const authRouts = require('./routes/user/auth');
const postRouts = require('./routes/tweet/posts');
const postServicesRouts = require('./routes/tweet/postServices');
const userServicesRouts = require('./routes/user/userServices');
const dmRoutes=require('./routes/dm/message');

const app = express();

// Bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.use('/user/auth',authRouts);
  app.use('/user/services',authRouts);
  app.use('/post',postRouts);
  app.use('/postServices',postServicesRouts);
  app.use('/userServices',userServicesRouts);
  app.use('/dm',dmRoutes);

  
  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data=error.data;
    res.status(status).json({ message: message,data :data});
  });


const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(process.env.MONGO_URL, dbOptions)
.then(result=>{
    app.listen(process.env.PORT, ()=> console.log(`Server is running on PORT: ${process.env.PORT}`));
    console.log('connected To mongodb ...');
});