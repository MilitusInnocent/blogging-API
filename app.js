const express = require('express');
const connectDB = require('./dB/connect');
require('dotenv').config();
const router = require('./routes/AuthRoutes');
const postRouter = require('./routes/postRoutes');
const passport = require('passport')
const bodyParser = require("body-parser")

// register passport
require("./passport") 



const app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

// middleware
app.use(express.json());


// routes
app.use('/posts', postRouter)
app.use('/', router)

app.get('/', (req, res) => {
  res.status(200).json({message: "Welcome to Militus blog app homepage"})
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message
  })
})

const start = async () => {
    try {
      // connectDB
      await connectDB(process.env.MONGO_URI);
      console.log('Connected to DB successfully')
      app.listen(PORT, () => console.log(`Server is listening PORT ${PORT}...`));
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
  