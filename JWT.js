const passport = require("passport");
const passportJWT = require("passport-jwt");
const { ExtractJwt, Strategy } = passportJWT;
const User = require("./models/schemas/user");

require("dotenv").config();
const secret = process.env.SECRET;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const callback = async function (payload, done) {
  User.findById(payload.id)
    .then((user) => {
      if (!user) {
        return done(new Error("User not found"));
      }
      return done(null, user);
    })
    .catch((error) => done(error));
};

passport.use(new Strategy(params, callback));
