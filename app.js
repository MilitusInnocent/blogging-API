const express = require('express');
const connectDB = require('./dB/connect');
require('dotenv').config();
const router = require('./routes/AuthRoutes');
const postRouter = require('./routes/postRoutes');
const passport = require('passport')

// register passport
require("./passport") 



const app = express()

const port = process.env.port || 3000

// middleware
app.use(express.json());


// routes
app.use('/posts', postRouter)
app.use('/', router)

const start = async () => {
    try {
      // connectDB
      await connectDB(process.env.MONGO_URI);
      console.log('Connected to DB successfully')
      app.listen(port, () => console.log(`Server is listening port ${port}...`));
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
  