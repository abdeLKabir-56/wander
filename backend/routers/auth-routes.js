const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;

router.get('/login',  (req, res) => 
{
    router.render('login');
});









//auth with google

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirects to Google OAuth authentication
 *     description: Redirects the user to Google OAuth authentication page for login.
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth authentication page
 */

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});




// Deserialize user from session

//auth with facebook

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Redirects to facebook OAuth authentication
 *     description: Redirects the user to facebook OAuth authentication page for login.
 *     responses:
 *       302:
 *         description: Redirects to facebook OAuth authentication page
 */

router.get('/facebook', (req, res) =>
{
    //handel with passport

    res.send('login with facebook');

});

//auth logout


router.get('/logout', (req, res) =>
{
    //handel with passport

    res.send('logout');

});





module.exports = router;