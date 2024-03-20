// profile-routes.js
const express = require('express');
const router = express.Router();



router.use((req, res, next) => {
  if (!req.user) {
     
     res.redirect('/dashboard');  
  }
  next();
});
router.get('/', (req, res) => {
  res.render('/dashboard', {user: req.user});
});





module.exports = router;