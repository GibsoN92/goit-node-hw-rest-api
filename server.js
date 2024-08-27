const app = require("./app");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 3000;
const uriDB = process.env.DB_HOST;

const connection = mongoose.connect(uriDB);

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(port, () => {
      console.log(`Server running. Use our API on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(
      `Server is not running! Something gone wrong with connection with DB. Error:${error.message}`
    );
    process.exit(1);
  });
