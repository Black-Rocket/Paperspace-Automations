const express = require('express');
const bcrypt = require('bcrypt');
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
      console.log('Password does not match!');
      req.app.locals.error = 'Passwords do not match!';
      res.redirect('/register');
      return;
    }

    // Find our user in the db
    findUser(req, res, username, password, apikey);
  } else {
    // display error and redirect to form
    req.app.locals.error = 'Missing registration information.';
    res.redirect('/register');
  }
});

/**
 * Find, validate, and save a user to the db.
 * @param {Request} req
 * @param {Response} res
 * @param {String} username
 * @param {String} password
 * @param {String} apiKey
 */
const findUser = async function(req, res, username, password, apiKey) {
  // check for existing usernames
  await User.findOne(
      {
        username: username,
      },
      (error, result) => {
        if (error) {
          throw error;
        }
        // If the username has already been used
        if (result != null) {
        // Redirect back to form since this is no longer valid
          req.app.locals.error = 'That username already exists!';
          res.redirect('/register');
          return;
        }
      }
  );

  // Hash our api key and password
  const salt = 10;
  let hashPassword = '';
  await bcrypt.hash(password, salt).then(function(hashedPassword) {
    hashPassword = hashedPassword;
  });

  // Will encrypt api keys when in production.
  /* let hashAPIKey = '';
  await bcrypt.hash(apikey, salt).then(function(hashedPassword) {
    hashAPIKey = hashedPassword;
  }); */

  // Create our user
  const newUser = await new User({
    username: username,
    password: hashPassword,
    apikey: apiKey,
  });

  // Save our user
  newUser.save();

  // clear any errors and set new user
  req.app.locals.error = '';
  req.app.locals.user = newUser;

  // Redirect
  res.redirect('/profile');
};

// Export our routes to the app
module.exports = router;
