const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const path = require("path");

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/users");
const { authMiddleWare } = require("./routes/controllers/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static(path.resolve(__dirname, "./public")));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./JWT");

app.use("/api/contacts", authMiddleWare, contactsRouter);

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Use api on routes: /api/auth/registration - registration user {username, email, password} /api/auth/login - login {email, password} /api/contact - get message if user is authenticated`,
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "Fail",
    code: 500,
    message: err.message,
    data: "Internal server error.",
  });
});

module.exports = app;
