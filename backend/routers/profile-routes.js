// profile-routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.use((req, res, next) => {
  if (!req.user) {
     // Send unauthorized response if not logged in
     res.redirect('/auth/login');
  }
  next(); // Proceed to next middleware/route if authenticated
});



/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the user's profile if authenticated.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized - User not logged in
 *       500:
 *         description: Internal Server Error
 */

router.get('/', (req, res) => {
  //test
  //res.send(`Welcome ${req.user.username}, this is your profile page`); 
  
  res.render('profile', {user: req.user});
});

router.get('/create-blog', (req, res) => {
  res.render('Post', { user: req.user }); 
});



router.post('/add-blog', userController.addBlog);



module.exports = router;