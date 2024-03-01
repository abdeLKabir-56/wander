const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routers/auth-routes');
const profileRoutes = require('./routers/profile-routes');
const passportSetup = require('./config/passport-setup');
const homeRoutes = require('./routers/home-routes');
const keys = require('./config/keys');
const uri = keys.mongodb.MONGO_URI;

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MongoDB connection
(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Use cookie-session middleware
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  keys: [keys.session.cookieKey]
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define Swagger options
const options = {
  swaggerDefinition: {
    info: {
      title: 'Wander Rest APIs',
      version: '1.0.0',
      description: 'This documentation is made using Swagger to showcase the APIs and their functionalities',
    },
  },
  apis: ['./routers/*.js'], // Path to the API routes
};

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount auth routes
app.use('/auth', authRoutes);

// Mount profile routes

app.use('/profile', profileRoutes);

// Mount home page route
app.use('/', homeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
