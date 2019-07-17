const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

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
    res.end();
  } else {
    // TODO: Add error for leaving info blank
    res.redirect('/login');
    res.end();
  }
});

// Export our routes to the app
module.exports = router;
