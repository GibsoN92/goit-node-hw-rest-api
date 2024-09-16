const app = require("./app");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

require("dotenv").config();

const port = process.env.MAIN_PORT || 3000;
const uriDB = process.env.DB_URL;

const connection = mongoose.connect(uriDB);

const pathToTempDir = path.join(process.cwd(), "tmp");
const pathToStoreImages = path.join(process.cwd(), "public/avatars");

const isAccess = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfDoesNotExist = async (folderPath) => {
  const result = await isAccess(folderPath);

  if (!result) {
    try {
      await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
};

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(port, async () => {
      await createFolderIfDoesNotExist(pathToTempDir);
      await createFolderIfDoesNotExist(pathToStoreImages);
      console.log(`Server running. Use our API on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(
      `Server is not running! Something gone wrong with connection with DB. Error:${error.message}`
    );
    process.exit(1);
  });
