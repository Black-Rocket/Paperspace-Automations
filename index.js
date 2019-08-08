// instance variables to use npm packages
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csurf = require('csurf');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const scheduler = require('node-schedule');
const paperspaceNode = require('paperspace-node');

const User = require('./models/user');

// declare the app and port
const app = express();
const port = 3000 || process.env.PORT;

// configure middleware
// logging
app.use(morgan('dev'));

// configure templating engine and static files
app.use(express.static('./public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// declare session
app.use(
	session({
		name: 'session',
		secret: 'r0cketwasablacklab',
		resave: true,
		saveUninitialized: true,
	})
);

// interacting with http requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Add in the csurf and cookie parser
app.use(cookieParser());

const csrfMiddleware = csurf({
	cookie: true,
});

// Protect against cross site request attacks
app.use(csrfMiddleware);

app.use((req, res, next) => {
	res.locals.csrftoken = req.csrfToken();
	next();
});

// helmet to protect headers
app.use(helmet());

// get routes
const routes = require('./Routes/routes');
const profileRoutes = require('./Routes/profile');
const loginRoutes = require('./Routes/login');
const registerRoutes = require('./Routes/register');
const machineRoutes = require('./Routes/machines');
app.use('/', routes, profileRoutes, registerRoutes, loginRoutes, machineRoutes);

// database connection
mongoose.connect(
	'mongodb+srv://admin:r0cketwasablacklab@cluster0-q7wih.mongodb.net/test?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
	}
);

// global app variables
app.locals.username = null;

// Only start the server if we can connect to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected!
	// console.log('Database connection successful!');

	// Start the server
	app.listen(port, () => {
		// ('Server started on port ' + port + '.');

		scheduler.scheduleJob('* * * * *', () => {
			automateMachines();
		});
	});
});

const automateMachines = async function() {
	// Get all of our users
	User.find({}, (err, users) => {
		if (err) throw err;

		// Iterate through each user's automated machines
		users.forEach((user) => {
			// Get the automated machines from the user
			if (user.automatedMachines.length > 0) {
				const automateMachines = user.automatedMachines;
				automateMachines.forEach((machine) => {
					// Get the boolean array of when to run
					const week = machine.dayOfWeek;
					// Get the current day (0 = Sunday, etc)
					const currentDate = new Date();
					currentDay = currentDate.getDay();

					// If today is scheduled to be automated, turn it on/ off
					if (week[currentDay]) {
						// Get the current time
						const currentHour = currentDate.getHours();
						const currentMinute = currentDate.getMinutes();

						// Get the automated start times and convert from string to int.
						const automatedStartTime = machine.startTime;
						const autoStartHour = parseInt(automatedStartTime.split(':')[0]);
						const autoStartMinute = parseInt(automatedStartTime.split(':')[1]);

						// Get the automated stop times and convert from string to int.
						const automatedEndTime = machine.endTime;
						const autoEndHour = parseInt(automatedEndTime.split(':')[0]);
						const autoEndMinute = parseInt(automatedEndTime.split(':')[1]);

						// If the current time is to start the machine, start it
						if (
							currentHour == autoStartHour &&
							currentMinute == autoStartMinute
						) {
							// Create our paperspace object
							const paperspace = paperspaceNode({
								apiKey: user.apikey,
							});

							// Start the machine
							paperspace.machines.start(
								{
									machineId: machine.id,
								},
								function(err) {
									if (err) throw err;
								}
							);
						}

						// If the current time is time to stop, stop the machine
						if (currentHour == autoEndHour && currentMinute == autoEndMinute) {
							// Create our paperspace object
							const paperspace = paperspaceNode({
								apiKey: user.apikey,
							});

							// Stop the machine
							paperspace.machines.stop(
								{
									machineId: machine.id,
								},
								function(err) {
									if (err) throw err;
								}
							);
						}
					}
				});
			}
		});
	});
};
