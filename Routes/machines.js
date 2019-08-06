const express = require('express');
const paperspaceNode = require('paperspace-node');
// eslint-disable-next-line new-cap
const router = express.Router();

const User = require('../models/user');

/**
 * This route shows all machines by class
 */
router.get('/machines', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
  const paperspace = paperspaceNode({
    apiKey: req.app.locals.user.apikey,
  });
  getMachines(res, paperspace);
});

/**
 * Start the machine given an id
 */
router.get('/machines/:id/start', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
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
});

/**
 * Stop the machine given an id
 */
router.get('/machines/:id/stop', (req, res, next) => {
  // AJAX success message here
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
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
        if (err) {
          throw err;
        }
      }
  );
  const url = '/machines/' + req.params.id + '/settings';
  res.redirect(url);
});

/**
 * Automate the machine given an id
 */
router.get('/machines/:id/settings', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
  const user = req.app.locals.user;
  // Create our paperspace object
  const paperspace = paperspaceNode({
    apiKey: user.apikey,
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

        let found = false;
        if (user.automatedMachines.length > 0) {
          for (let i = 0; i < user.automatedMachines.length; i++) {
            if (user.automatedMachines[i].id == machineId) {
              found = true;
              break;
            }
          }
        }

        res.render('settings', {
          machine: result,
          automated: found,
        });
      }
  );
});

/**
 * Add this machine to automated machines.
 */
router.post('/machines/:id/enable-automation', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
  // Instantiate a new machine
  const newMachine = {
    id: req.params.id,
    startDate: null,
    endDate: null,
    autoMonday: false,
    autoTuesday: false,
    autoWednesday: false,
    autoThursday: false,
    autoFriday: false,
    autoSaturday: false,
    autoSunday: false,
  };

  // Find the user in our db from our local user.
  User.findOne(
      {
        username: req.app.locals.user.username,
      },
      (err, result) => {
        if (err) throw err;

        // Machine already is automated
        if (result != null) {
          // Add the new machine to the array and save to DB
          result.automatedMachines.push(newMachine);
          result.save();
          // Save our machines to local user
          req.app.locals.user.automatedMachines = result.automatedMachines;
          // Redirect back to the settings
          res.redirect('back');
        }
      }
  );
});

/**
 * Remove this machine from automated machines.
 */
router.post('/machines/:id/disable-automation', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }
  // Find the user in our db from our local user.
  User.findOne(
      {
        username: req.app.locals.user.username,
      },
      (err, result) => {
        if (err) {
          throw err;
        }

        // Find our machine by id and delete it, then update to DB.
        const positionToDelete =
          result.automatedMachines.indexOf(req.params.id);
        result.automatedMachines.splice(positionToDelete, 1);
        result.save();
        // Save our machines to local user
        req.app.locals.user.automatedMachines = result.automatedMachines;
        // Redirect back to the settings
        res.redirect('back');
      }
  );
});

/**
 * Add or change the start and end times to desired automated machine.
 */
router.post('/machines/:id/automate', (req, res, next) => {
  // Make sure we are logged in
  if (!req.app.locals.user) {
    res.redirect('/');
    return;
  }

  console.log('start time', req.body.startTime);
  console.log('end time', req.body.endTime);
  console.log('autoMonday', req.body.autoMonday);
  console.log('autoTuesday', req.body.autoTuesday);
  console.log('autoWednesday', req.body.autoWednesday);
  console.log('autoThursday', req.body.autoThursday);
  console.log('autoFriday', req.body.autoFriday);
  console.log('autoSaturday', req.body.autoSaturday);
  console.log('autoSunday', req.body.autoSunday);

  res.redirect('/back');
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
