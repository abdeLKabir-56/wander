const router = require('express').Router();
router.get('/', (req, res) => {
    //router.render('index');
    res.send("here you should render the home page");
});

router.get('/about', (req, res) => {
    //router.render('about');
    res.send("here you should render the about page");
});

module.exports = router;