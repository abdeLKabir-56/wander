const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;







router.get('/login',  (req, res) => 
{
    //res.render('login',{user: req.user});
    //test 
    res.send('login page');
});




/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect to Google OAuth authentication
 *     description: Redirects the user to Google OAuth authentication page for login.
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth authentication page
 */

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));




/**
 * @swagger
 * /auth/google/redirect:
 *   get:
 *     summary: Google OAuth redirect route
 *     description: Callback route for Google OAuth authentication.
 *     responses:
 *       302:
 *         description: Redirects to profile page upon successful authentication
 */

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});




/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Redirect to Facebook OAuth authentication
 *     description: Redirects the user to Facebook OAuth authentication page for login.
 *     responses:
 *       302:
 *         description: Redirects to Facebook OAuth authentication page
 */

router.get('/facebook', (req, res) =>
{
    //handel with passport

    res.send('login with facebook');

});


/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     description: Logs out the authenticated user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal Server Error
 */

router.get('/logout', (req, res) =>
{
    //handel with passport
    //res.send('logout');
    req.logout();
    res.redirect('/');
});





module.exports = router;