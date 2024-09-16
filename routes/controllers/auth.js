const passport = require("passport");
const MongooseService = require("../../models/auth.js");
const JWT = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendVerifyToken } = require("../../models/email.js");

require("dotenv").config();

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await MongooseService.findUserByEmail(email);
    if (user) {
      return res.status(409).json({
        status: "Error",
        code: 409,
        message: "Email in use",
      });
    }
    const avatarURL = gravatar.url(
      email,
      { s: "300", d: "wavatar", r: "x" },
      true
    );
    const verificationToken = nanoid();

    const newUser = await MongooseService.createUser({
      username,
      email,
      password,
      avatarURL,
      verificationToken,
    });
    await newUser.setPassword(password);
    await newUser.save();

    await sendVerifyToken(verificationToken, email);

    return res.status(201).json({
      status: "Success",
      code: 201,
      message: "User successfully created!",
      user: {
        username: newUser.username,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await MongooseService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "User doesn't exist",
      });
    }

    const isPasswordCorrect = await user.validPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Email or password is wrong",
        data: "Bad request",
      });
    }
    if (user.verify === false) {
      return res.status(400).json({
        status: "Error",
        code: 401,
        message: "User is not verified yet.",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };
    const secret = process.env.SECRET;
    const token = JWT.sign(payload, secret, { expiresIn: "2h" });

    user.token = token;
    user.save();

    return res.status(200).json({
      status: "Success",
      code: 200,
      message: "Successfully logged in.",
      token: token,
      user: {
        username: user.username,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.token === null) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Not authorized",
      });
    }

    user.token = null;
    user.save();

    return res.status(204);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.token === null) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      status: "Success",
      code: 200,
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const authMiddleWare = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  register,
  login,
  authMiddleWare,
  logout,
  current,
};
