const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	password: String,
	apikey: String,
	automatedMachines: [
		{
			id: String,
			startTime: String,
			endTime: String,
			dayOfWeek: [],
		},
	],
});

const User = mongoose.model('User', UserSchema);

(module.exports = User), UserSchema;
