
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routers/auth-routes');
const passportSetup = require('./config/passport-setup');
const homeRoutes = require('./routers/home-routes');
const keys = require('./config/keys');
const uri = keys.mongodb.MONGO_URI;


//database coonection
(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();


// Define Swagger options
const options = {
  swaggerDefinition: {
    info: {
      title: 'Wander Rest APIs',
      version: '1.0.0',
      description: 'this documentation is maded into Swagger to show you how some information about the apis and how they work',
    },
    
  },
  apis: ['./routers/*.js'], // Path to the API routes
};

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


//auth routes
app.use('/auth', authRoutes);

//home page route
app.use('/',homeRoutes);


app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
