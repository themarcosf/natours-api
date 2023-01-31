/** command line script for importing and deleting collections of data */
require("dotenv").config({ path: `${__dirname}/../../config.env` });

const fs = require("fs");
const mongoose = require("mongoose");

const Tour = require("./../../models/tourModel");
const User = require("./../../models/userModel");
const Review = require("./../../models/reviewModel");
////////////////////////////////////////////////////////////////////////////////

// remote database
const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// local database
// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then((conn) => console.log(`DB Connected: ${conn.connections[0].name}`));
////////////////////////////////////////////////////////////////////////////////

// data management
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const _import = async () => {
  try {
    await Tour.create(tours);
    // @dev comment out password encryption middleware in user Model
    // @dev sample user data already has encrypted passwords
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const _delete = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// @dev command: node cli-data-mngmt.js --import
if (process.argv.includes("--import")) {
  _import();
}

// @dev command: node cli-data-mngmt.js --delete
if (process.argv.includes("--delete")) {
  _delete();
}
