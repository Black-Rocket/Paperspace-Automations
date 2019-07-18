const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const User = require('../models/user');
/**
 * The get request for logging into an existing account
 */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/**
 * The post request for logging into an existing account
 */
router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Find if the username exists
    User.findOne({username: username, password: password}, (err, result) => {
      if (err) {
        next(err);
      } else {
        if (result != null) {
          // Username checks out!
          req.app.locals.user = result;

          res.redirect('/profile');
        } else {
          // No username here!
          req.app.locals.error = 'Invalid username or password!';
          res.redirect('/login');
        }
      }
    });
  }
});

/**
 * Destroy the user session when logging out
 */
router.all('/logout', (req, res, next) => {
  req.session.destroy();
  req.app.locals.user = null;
  res.redirect('/');
});

// Export our routes to the app
module.exports = router;
