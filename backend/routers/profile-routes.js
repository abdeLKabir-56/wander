// profile-routes.js
const express = require('express');
const router = express.Router();

// Ensure user is authenticated before accessing profile routes
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized'); // Send unauthorized response if not logged in
  }
  next(); // Proceed to next middleware/route if authenticated
});

router.get('/', (req, res) => {
  res.send(`Welcome ${req.user.username}, this is your profile page`); // Use username from the user object
});

module.exports = router;