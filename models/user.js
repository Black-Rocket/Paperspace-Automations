const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  apikey: String,
  automatedMachines: [{id: String, startDate: Date, endDate: Date}],
});

const User = mongoose.model('User', UserSchema);

module.exports = User, UserSchema;
