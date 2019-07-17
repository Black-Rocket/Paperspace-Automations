const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * The get request for the home page.
 */
router.get('/', (req, res, next) => {
  res.render('index');
});

/**
 * The get request for viewing an FAQ for how the app works.
 */
router.get('/about', (req, res, next) => {
  res.render('about');
});

/**
 * The get request for viewing all the current machines
 */
router.get('/profile', (req, res, next) => {
  res.render('profile');
});

// Export our routes to the app
module.exports = router;
