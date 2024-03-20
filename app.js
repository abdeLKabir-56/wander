require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const methodOverride = require('method-override');
const PORT = 5000 || process.env.PORT;
//const mongodb_local_url = process.env.MONGO_LOCAL_URL;
const passport = require('passport');
const authRoutes = require('./server/routes/auth-routes');
const profileRoutes = require('./server/routes/profile-routes');
const passportSetup = require('./server/config/passport-setup');


//database connection
connectDB();


//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'My secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_LOCAL_URL
    }),
}));
// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

 

app.use(express.static('public'));
//Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/user'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,(req, res) => {
    console.log(`the server is listening on port ${PORT} `);
});
