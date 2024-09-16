const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().email(),
});

const isEmailValid = (body) => {
  const { error } = schema.validate(body);
  if (error) {
    return error.details[0].message;
  } else {
    return true;
  }
};

module.exports = isEmailValid;
