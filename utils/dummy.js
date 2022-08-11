const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../models/User");
require("dotenv").config({ path: "../.env.local" });

const CONNECTION_STRING = process.env.CONNECTION_STRING;

const download = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to database");
    let results = await User.find({}).select("-_id +password");

    fs.writeFileSync("./results.json", JSON.stringify(results));

    console.log("data written");
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
};

const upload = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to database");
    let results = await User.find({}).select("-_id +password");

    fs.writeFileSync("./results.json", JSON.stringify(results));

    console.log("data written");
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
};
