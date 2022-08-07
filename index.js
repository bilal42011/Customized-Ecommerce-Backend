const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const main = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (e) {
    console.error(e);
  }
};

main();
