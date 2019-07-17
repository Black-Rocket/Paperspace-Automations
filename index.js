// instance variables to use npm packages
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
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
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
    })
);

// interacting with http requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// get routes
const routes = require('./Routes/routes');
const profileRoutes = require('./Routes/profile');
const loginRoutes = require('./Routes/login');
const registerRoutes = require('./Routes/register');
app.use('/', routes, profileRoutes, registerRoutes, loginRoutes);


// database connection
mongoose.connect('mongodb://localhost:27017/br-example', {
  useNewUrlParser: true,
});

// Only start the server if we can connect to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connection successful!');

  /**
   * Start the server on port 3000 or another port.
   */
  app.listen(port, () => {
    console.log('Server started on port ' + port + '.');
  });
});