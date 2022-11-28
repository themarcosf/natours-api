const { terminate } = require("./utils/lib");

// environment variables
require("dotenv").config({ path: "./config.env" });
//////////////////////////////////////////////////////////////////

// unhandled (sync) exceptions handler
process.on("uncaughtException", (err) => terminate(err));
//////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");

// remote database
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// local database
const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then((conn) => console.log(`DB connected to: ${conn.connections[0].name}`));

/**
 *REMINDER: deprecation warnings
 *{
 *  useNewUrlParser: true,
 *  useCreateIndex: true,
 *  useFindAndModify: false,
 *}
 */
//////////////////////////////////////////////////////////////////

// server
const app = require("./app");

const server = app.listen(
  process.env.PORT || 8000,
  process.env.HOST || "127.0.0.1",
  () => console.log(`Server running on port ${process.env.PORT}`)
);
//////////////////////////////////////////////////////////////////

// unhandled (async) rejections handler
process.on("unhandledRejection", (err) => terminate(err, server));
