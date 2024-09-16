const express = require("express");
const router = express.Router();
const userOperations = require("../controllers/users");
const authOperations = require("../controllers/auth");

router.patch(
  "/avatars",
  authOperations.authMiddleWare,
  userOperations.upload.single("avatar"),
  userOperations.updateAvatar
);

router.get("/verify/:verificationToken", userOperations.verify);

router.post("/verify", userOperations.verifyAgain);
module.exports = router;
