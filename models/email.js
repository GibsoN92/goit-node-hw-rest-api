const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendVerifyToken = async (token, email) => {
  const emailOptions = {
    from: "'Bartek'  <postmaster@sandboxb14077c212244298830c6ee5e6425dfd.mailgun.org>",
    to: email,
    subject: "Please verify your email",
    text: `Hello, click here to verify your email: http://localhost:3000/api/users/verify/${token}`,
  };

  return await transporter.sendMail(emailOptions);
};

const sendVerificationConfirmed = async (email) => {
  const emailOptions = {
    from: "'Bartek'  <postmaster@sandboxb14077c212244298830c6ee5e6425dfd.mailgun.org>",
    to: email,
    subject: "Email verified successfully!",
    text: "Thank you! Your email has been verified!",
  };
  return await transporter.sendMail(emailOptions);
};

module.exports = { sendVerifyToken, sendVerificationConfirmed };
