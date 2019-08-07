const express = require('express');
const bcrypt = require('bcrypt');
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
		loginUser(req, res, username, password);
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

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {String} username
 * @param {String} password
 */
const loginUser = async function(req, res, username, password) {
	// Find if the username exists
	await User.findOne(
		{
			username: username,
		},
		(err, result) => {
			if (err) {
				throw err;
			} else {
				if (result != null) {
					// Load hash from your password DB.
					bcrypt.compare(password, result.password, function(err) {
						if (err) throw err;
						// Username and password checks out!
						req.app.locals.error = '';
						req.app.locals.user = result;
						res.redirect('/profile');
					});
				} else {
					// No username here!
					req.app.locals.error = 'Invalid username or password!';
					res.redirect('/login');
				}
			}
		}
	);
};

// Export our routes to the app
module.exports = router;
