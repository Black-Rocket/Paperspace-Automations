const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const User = require('../models/user');

/**
 * The get request for making an account
 */
router.get('/register', (req, res, next) => {
  if (req.session.error != '') {
    res.render('register', {error: req.session.error});
  }
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
  if (username && password && apikey) {
    // Confirm that the correct password was typed in
    if (password != confirmPassword) {
      req.session.error = 'Passwords do not match!';
      res.redirect('/register');
      res.end();
    }

    const newUser = new User({
      username: username,
      password: password,
      apikey: apikey,
    });

    newUser.save((err) => {
      if (err) throw err;

      console.log('New user ' + username + ' was created.');
    });

    req.session.error = '';
    req.session.user = newUser;

    res.redirect('/profile');
    res.end();
  } else {
    req.session.error = 'Missing registration information';
    res.redirect('/register');
    res.end();
  }
});

// Export our routes to the app
module.exports = router;
