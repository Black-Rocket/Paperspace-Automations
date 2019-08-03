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
 * Start the machine given an id
 */
router.get('/machines/:id/start', (req, res, next) => {
  if (req.app.locals.user) {
    // AJAX success message here
    const paperspace = paperspaceNode({
      apiKey: req.app.locals.user.apikey,
    });
    paperspace.machines.start(
        {
          machineId: req.params.id,
        },
        function(err, result) {
          if (err) throw err;
        }
    );
    const url = '/machines/'+ req.params.id +'/settings';
    res.redirect(url);
  }
});

/**
 * Stop the machine given an id
 */
router.get('/machines/:id/stop', (req, res, next) => {
  if (req.app.locals.user) {
    // AJAX success message here
    const paperspace = paperspaceNode({
      apiKey: req.app.locals.user.apikey,
    });
    paperspace.machines.stop(
        {
          machineId: req.params.id,
        },
        function(err, result) {
          if (err) throw err;
        }
    );
    const url = '/machines/' + req.params.id + '/settings';
    res.redirect(url);
  }
});

/**
 * Automate the machine given an id
 */
router.get('/machines/:id/settings', (req, res, next) => {
  if (req.app.locals.user) {
    // Create our paperspace object
    const paperspace = paperspaceNode({
      apiKey: req.app.locals.user.apikey,
    });

    // Get the machine id from request
    const machineId = req.params.id;

    // Get the details of the machine from the id
    paperspace.machines.show(
        {
          machineId: machineId,
        },
        function(err, result) {
          if (err) throw err;
          res.render('settings', {machine: result});
        }
    );
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
