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
    User.findOne({username: username, password: password}, (err, result) => {
      if (err) throw err;
      const user = result;
      req.session.user = user;
      res.redirect('/profile');
      res.end();
    });
  } else {
    // TODO: Add error for leaving info blank
    res.redirect('/login');
    res.end();
  }
});

/**
 * Destroy the user session when logging out
 */
router.all('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
  res.end();
});

// Export our routes to the app
module.exports = router;
