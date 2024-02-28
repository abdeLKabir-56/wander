const router = require('express').Router();
const passport = require('passport');

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

router.get('/google', (req, res) => {
    // Handle with passport
    passport.authenticate('google', {
        scope: ['profile'] // What we want to retrieve from the client (id, email, picture...)
    })(req, res);
});

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


//callback redirect
router.get('/google/redirect', passport.authenticate('google'),(req, res) =>
{
    res.send(' you are reached callback url');
});


module.exports = router;