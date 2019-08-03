const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  apikey: String,
  automatedMachines: [
    {
      id: String,
      startDate: Date,
      endDate: Date,
      autoMonday: Boolean,
      autoTuesday: Boolean,
      autoWednesday: Boolean,
      autoThursday: Boolean,
      autoFriday: Boolean,
      autoSaturday: Boolean,
      autoSunday: Boolean,
    },
  ],
});

const User = mongoose.model('User', UserSchema);

(module.exports = User), UserSchema;
