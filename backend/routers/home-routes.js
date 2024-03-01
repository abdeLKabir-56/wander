const router = require('express').Router();


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home page
 *     description: Returns the home page.
 *     responses:
 *       200:
 *         description: Home page retrieved successfully
 *       500:
 *         description: Internal Server Error
 */




router.get('/', (req, res) => {
    //we pass the user into home page just for view botton controlling 
    //, for exemple afetr loging out the user sould not view logout botton or profile button
    //test 
    res.send("here you should render the home page");
    //res.render('index',{user: req.user});
    
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get about page
 *     description: Returns the about page.
 *     responses:
 *       200:
 *         description: About page retrieved successfully
 *       500:
 *         description: Internal Server Error
 */

router.get('/about', (req, res) => {
    //tset
    res.send("here you should render the about page");
    //res.render('about');
    
});

module.exports = router;