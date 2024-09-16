const fs = require("fs").promises;
const { Jimp } = require("jimp");
const multer = require("multer");
const { nanoid } = require("nanoid");
const path = require("path");
const MongooseService = require("../../models/auth.js");
const {
  sendVerificationConfirmed,
  sendVerifyToken,
} = require("../../models/email.js");
const isEmailValid = require("../../models/schemas/email.js");

const pathToTempDir = path.join(process.cwd(), "tmp");
const pathToStoreImages = path.join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, callbback) => {
    callbback(null, pathToTempDir);
  },
  filename: (req, file, callback) => {
    callback(null, `${nanoid()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const extensionsWhiteList = [".jpg", "jpeg", ".png", ".gif", "webp"];
    const mimetypeWhiteList = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const extension = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (
      !extensionsWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return callback(null, false);
    }

    return callback(null, true);
  },
  limits: { fileSize: 1048576 },
});

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "File is not a picture.",
      });
    }
    const nameFile = req.file.filename;
    const pathFile = req.file.path;
    const newPathFile = path.join(pathToStoreImages, nameFile);

    try {
      await Jimp.read(pathFile)
        .then((image) => {
          image.resize({ w: 250, h: 250 }).write(pathFile);
        })
        .catch((error) => error);
    } catch (error) {
      console.error("Error processing image:", error);
      return next(error);
    }

    try {
      await fs.rename(pathFile, newPathFile);
    } catch (error) {
      await fs.unlink(pathFile);
      next(error);
    }

    const user = req.user;

    user.avatarURL = path.join("http://localhost:3000/avatars", nameFile);
    user.save();

    return res.status(200).json({ user: user, message: "Avatar updated." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const token = req.params.verificationToken;
    const userWithToken = await MongooseService.findByVerifyToken(token);
    if (!userWithToken) {
      return res.status(404).json({
        status: "Error",
        code: 404,
        message: "User not found",
      });
    }
    userWithToken.verificationToken = "null";
    userWithToken.verify = true;
    await userWithToken.save();

    await sendVerificationConfirmed(userWithToken.email);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification successful.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verifyAgain = async (req, res, next) => {
  try {
    const validBody = isEmailValid(req.body);
    if (!validBody) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: validBody,
      });
    }
    const email = req.body.email;
    const userWithToken = await MongooseService.findUserByEmail(email);

    if (userWithToken.verify) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Verification has already been passed.",
      });
    }

    const verificationToken = nanoid();

    userWithToken.verificationToken = verificationToken;
    await userWithToken.save();

    await sendVerifyToken(verificationToken, email);

    return res.status(200).json({
      status: "Success",
      code: 200,
      message: "Verification email sent.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { updateAvatar, upload, verify, verifyAgain };
