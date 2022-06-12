const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { DataBase } = require('../database');

function ConfigureLocalStrategy() {
  // Called during login/sign up
  passport.use(
    'LocalStrategy',
    new LocalStrategy(DataBase.getInstance().UserModel.authenticate())
  );

  // Called while after logging in / signing up to set user details in req.user
  passport.serializeUser(DataBase.getInstance().UserModel.serializeUser());
}

// export default ConfigureLocalStrategy;

module.exports = {
  ConfigureLocalStrategy
};
