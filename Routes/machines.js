const express = require('express');
const paperspaceNode = require('paperspace-node');
// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * This route shows all machines by class
 */
router.get('/machines', (req, res, next) => {
  if (req.app.locals.user) {
    const paperspace = paperspaceNode({
      apiKey: req.app.locals.user.apikey,
    });
    getMachines(res, paperspace);
  } else {
    res.render('machines', {machines: null});
  }
});

/**
 *
 * @param {Response} res
 * @param {*} paperspace
 */
const getMachines = async function(res, paperspace) {
  paperspace.machines.list((err, result) => {
    if (err) {
      res.redirect('/profile');
      return;
    } else {
      res.render('machines', {machines: result});
    }
  });
};

// Export our routes to the app
module.exports = router;
