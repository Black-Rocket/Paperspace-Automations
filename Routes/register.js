const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const User = require('../models/user');
/**
 * The get request for making an account
 */
router.get('/register', (req, res, next) => {
  res.render('register');
});

/**
 * The post request for making an account
 */
router.post('/register', (req, res, next) => {
  // Get data from the form
  username = req.body.username;
  password = req.body.password;
  confirmPassword = req.body.confirmPassword;
  apikey = req.body.apikey;

  // Make sure the username and password have been entered
  if (username && password && confirmPassword && apikey) {
    // Confirm that the correct password was typed in
    if (password.localeCompare(confirmPassword)) {
      req.app.locals.error = 'Passwords do not match!';
      res.redirect('/register');
      res.end();
    }

    const newUser = new User({
      username: username,
      password: password,
      apikey: apikey,
    });

    newUser.save((err) => {
      if (err) {
        next(err);
      }
    });

    // clear any errors and set new user
    req.app.locals.error = '';
    req.app.locals.user = newUser;

    res.redirect('/profile');
    res.end();
  } else {
    // display error and redirect to form
    req.app.locals.error = 'Missing registration information';
    res.redirect('/register');
    res.end();
  }
});

// Export our routes to the app
module.exports = router;
