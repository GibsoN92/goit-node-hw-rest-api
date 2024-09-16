const User = require("./schemas/user.js");

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};
const findUserById = async (id) => {
  return await User.findById(id);
};
const createUser = async ({
  username,
  email,
  password,
  avatarURL,
  verificationToken,
}) => {
  return await new User({
    username,
    email,
    password,
    avatarURL,
    verificationToken,
  });
};
const findByVerifyToken = async (token) => {
  return await User.findOne({ verificationToken: token });
};
module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findByVerifyToken,
};
