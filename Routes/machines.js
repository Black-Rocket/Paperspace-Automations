const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
/**
 * This route shows all machines by class
 */
router.get('/machines', (req, res, next) => {
  res.render('machines');
});

// Export our routes to the app
module.exports = router;
