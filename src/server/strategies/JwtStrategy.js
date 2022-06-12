const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { DataBase } = require('../database');

function ConfigureJwtStrategy() {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET;

  // Used by the authenticated requests to deserialize the user,
  // i.e., to fetch user details from the JWT.
  passport.use(
    'JwtStrategy',
    new Strategy(opts, ((payload, done) => {
      // Check against the DB only if necessary.
      // This can be avoided if you don't want to fetch user details in each request.
      DataBase.getInstance().UserModel.findOne({ _id: payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
        // or you could create a new account
      });
    }))
  );
}

// export default ConfigureJwtStrategy;

module.exports = {
  ConfigureJwtStrategy
};
