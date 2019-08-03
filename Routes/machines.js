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
    const url = '/machines/' + req.params.id + '/settings';
    res.redirect(url);
  }
});

/**
 * Stop the machine given an id
 */
router.get('/machines/:id/stop', (req, res, next) => {
  // Make sure we are logged in
  if (req.app.locals.user) {
    // AJAX success message here
    // Create the paperspace object
    const paperspace = paperspaceNode({
      apiKey: req.app.locals.user.apikey,
    });

    // Stop the machine
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
  // Make sure we are logged in
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
 * Add this machine to automated machines.
 */
router.post('/machines/:id/enable-automation', (req, res, next) => {
  // Make sure we are logged in
  if (req.app.locals.user) {
    console.log('enable auto');
  }
});

/**
 * Remove this machine from automated machines.
 */
router.post('/machines/:id/disable-automation', (req, res, next) => {
  // Make sure we are logged in
  if (req.app.locals.user) {
    console.log('disable auto');
  }
});

/**
 * Add or change the start and end times to desired automated machine.
 */
router.post('/machines/:id/automate', (req, res, next) => {
  // Make sure we are logged in
  if (req.app.locals.user) {
  }
});

/**
 *Get machines to place in our machines view
 * @param {Response} res
 * @param {*} paperspace
 */
const getMachines = async function(res, paperspace) {
  // Get all of our machines
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
