// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const SessionSchema = new Schema({
  refreshToken: {
    type: String,
    default: '',
  },
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  authStrategy: {
    type: String,
    default: 'local',
  },
  points: {
    type: Number,
    default: 50,
  },
  refreshToken: {
    type: [SessionSchema],
  },
});

// Remove refreshToken from the response
UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

UserSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model('User', User);

module.exports = {
  UserSchema
};
