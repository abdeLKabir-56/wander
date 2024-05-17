require('dotenv').config();
const express = require('express');

const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const methodOverride = require('method-override');
const PORT = process.env.PORT || 5000; // Adjusted the PORT setup
const passport = require('passport');
const authRoutes = require('./server/routes/auth-routes');
const profileRoutes = require('./server/routes/profile-routes');
const passportSetup = require('./server/config/passport-setup');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createCanvas } = require('canvas');
const server = http.createServer(app);
const io = new Server(server);
const Post = require('./server/models/blog');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Import routes
const mainRoutes = require('./server/routes/main');
const userRoutes = require('./server/routes/user');
const adminRoutes = require('./server/routes/admin');
const commentRoutes = require('./server/routes/comment');
//database connection
connectDB();

//socket io connection
let visitorCount = 0;

io.on('connection', (socket) => {
    visitorCount++;
    io.emit('visitorCount', visitorCount);

    socket.on('disconnect', () => {
        visitorCount--;
        io.emit('visitorCount', visitorCount);
    });
});
//swagger
const options = {
    swaggerDefinition: {
      info: {
        title: 'Wander Rest APIs',
        version: '1.0.0',
        description: 'This documentation is made using Swagger to showcase the APIs and their functionalities',
      },
    },
    apis: ['./server/routes/*.js'], // Path to the API routes
  };
  

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(methodOverride('_method'));
app.use(session({
    secret: 'My secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_LOCAL_URL || 'mongodb://localhost/yourDBName',
    }),
}));
// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './public')));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes setup
app.use('/auth', authRoutes);
app.use('/dashboard', userRoutes);
app.use('/profile', profileRoutes);
app.use('/', mainRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', commentRoutes);




// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
