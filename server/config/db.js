require('dotenv').config();
const mongodb_url = process.env.MONGO_URL;
const mongoose = require('mongoose');
const mongodb_local_url = process.env.MONGO_LOCAL_URL;

const connectDB = async () => {
    console.log("MongoDB URL:", mongodb_local_url);
    mongoose.connect(mongodb_local_url)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
      });
    }

    module.exports = connectDB;
