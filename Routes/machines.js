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

  // Get the details of the machine from the id
  // Find the user in our db from our local user.
  // Get the machine id from request
  const machineId = req.params.id;
  const user = req.app.locals.user;
  // Create our paperspace object
  const paperspace = paperspaceNode({
    apiKey: user.apikey,
  });
  // Get the details of the machine from the id
  paperspace.machines.show(
      {
        machineId: machineId,
      },
      function(err, result) {
        if (err) throw err;

        const paperspaceMachine = result;
        // Get our user so we can get our DB automation settings
        User.findOne(
            {
              username: req.app.locals.user.username,
            },
            (err, result) => {
              if (err) {
                throw err;
              }

              // Find our machine by id and update it, then update to DB.
              let found = false;
              let settingsIndex = -1;
              for (let i = 0; i < result.automatedMachines.length; i++) {
                if (result.automatedMachines[i].id === req.params.id) {
                  found = true;
                  settingsIndex = i;
                  break;
                }
              }
              const machineSettings = result.automatedMachines[settingsIndex];
              res.render('settings', {
                machine: paperspaceMachine,
                automated: found,
                settings: machineSettings,
              });
            }
        );
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
    startTime: 'notime',
    endTime: 'notime',
    dayOfWeek: [false, false, false, false, false, false, false],
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
        let posToDelete = -1;
        for (let i = 0; i < result.automatedMachines.length; i++) {
          if (result.automatedMachines[i].id === req.params.id) {
            posToDelete = i;
            break;
          }
        }
        result.automatedMachines.splice(posToDelete, 1);
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

  // Get data from checkboxes
  if (req.body.autoMonday === 'on') {
    updateDay(req, 0, true);
  } else {
    updateDay(req, 0, false);
  }
  if (req.body.autoTuesday === 'on') {
    updateDay(req, 1, true);
  } else {
    updateDay(req, 1, false);
  }
  if (req.body.autoWednesday === 'on') {
    updateDay(req, 2, true);
  } else {
    updateDay(req, 2, false);
  }
  if (req.body.autoThursday === 'on') {
    updateDay(req, 3, true);
  } else {
    updateDay(req, 3, false);
  }
  if (req.body.autoFriday === 'on') {
    updateDay(req, 4, true);
  } else {
    updateDay(req, 4, false);
  }
  if (req.body.autoSaturday === 'on') {
    updateDay(req, 5, true);
  } else {
    updateDay(req, 5, false);
  }
  if (req.body.autoSunday === 'on') {
    updateDay(req, 6, true);
  } else {
    updateDay(req, 6, false);
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

        // Find our machine by id and update it, then update to DB.
        let posToUpdate = -1;
        for (let i = 0; i < result.automatedMachines.length; i++) {
          if (result.automatedMachines[i].id === req.params.id) {
            posToUpdate = i;
            break;
          }
        }

        result.automatedMachines[posToUpdate].startTime = req.body.startTime;
        result.automatedMachines[posToUpdate].endTime = req.body.endTime;
        result.save();

        // Save our machines to local user
        req.app.locals.user.automatedMachines = result.automatedMachines;
        res.redirect(`/machines/${req.params.id}/settings`);
      }
  );
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

/**
 *  Update a machine to run or not on a specific day and update the local user
 * @param {Request} req
 * @param {number} day
 * @param {boolean} run
 */
const updateDay = async function(req, day, run) {
  if (run) {
    // Find the user in our db from our local user.
    User.findOne(
        {
          username: req.app.locals.user.username,
        },
        (err, result) => {
          if (err) {
            throw err;
          }

          // Find our machine by id and update it, then update to DB.
          let posToUpdate = -1;
          for (let i = 0; i < result.automatedMachines.length; i++) {
            if (result.automatedMachines[i].id === req.params.id) {
              posToUpdate = i;
              break;
            }
          }

          result.automatedMachines[posToUpdate].dayOfWeek.set(day, true);

          result.save();
          // Save our machines to local user
          req.app.locals.user.automatedMachines = result.automatedMachines;
        }
    );
  } else {
    // Find the user in our db from our local user.
    User.findOne(
        {
          username: req.app.locals.user.username,
        },
        (err, result) => {
          if (err) {
            throw err;
          }

          // Find our machine by id and update it, then update to DB.
          let posToUpdate = -1;
          for (let i = 0; i < result.automatedMachines.length; i++) {
            if (result.automatedMachines[i].id === req.params.id) {
              posToUpdate = i;
              break;
            }
          }

          result.automatedMachines[posToUpdate].dayOfWeek.set(day, false);
          result.save();
          // Save our machines to local user
          req.app.locals.user.automatedMachines = result.automatedMachines;
        }
    );
  }
};

// Export our routes to the app
module.exports = router;
