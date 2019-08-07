const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * The get request for viewing all the current machines
 */
router.get('/profile', (req, res, next) => {
	res.render('profile');
});

// Export our routes to the app
module.exports = router;
