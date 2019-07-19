// instance variables to use npm packages
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csurf = require('csurf');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

// declare the app and port
const app = express();
const port = 3000 || process.env.PORT;

// configure middleware
// logging
app.use(morgan('dev'));

// configure templating engine and static files
app.use(express.static('./public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// declare session
app.use(
    session({
      name: 'session',
      secret: 'r0cketwasablacklab',
      resave: true,
      saveUninitialized: true,
    })
);

// interacting with http requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Add in the csurf and cookie parser
app.use(cookieParser());

const csrfMiddleware = csurf({
  cookie: true,
});

app.use(csrfMiddleware);

app.use((req, res, next) => {
  res.locals.csrftoken = req.csrfToken();
  next();
});

// helmet to protect headers
app.use(helmet());

// get routes
const routes = require('./Routes/routes');
const profileRoutes = require('./Routes/profile');
const loginRoutes = require('./Routes/login');
const registerRoutes = require('./Routes/register');
const machineRoutes = require('./Routes/machines');
app.use('/', routes, profileRoutes, registerRoutes, loginRoutes, machineRoutes);

// database connection
mongoose.connect('mongodb://localhost:27017/br-example', {
  useNewUrlParser: true,
});

// global app variables
app.locals.username = null;

// Only start the server if we can connect to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connection successful!');

  // Start the server
  app.listen(port, () => {
    console.log('Server started on port ' + port + '.');
  });
});
