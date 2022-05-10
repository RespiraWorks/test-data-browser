// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Create Model
const { Schema } = mongoose;
const User = new Schema({
  // username: { type: String, required: true },
  // password: { type: String, required: true }
  username: String,
  password: String
});
// Export Model
User.plugin(passportLocalMongoose);

module.exports = {
  User
};
