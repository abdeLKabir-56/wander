// profile-routes.js

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
        res.send(`Welcome ${req.user.username}, this is your profile page`); 
});

module.exports = router;
