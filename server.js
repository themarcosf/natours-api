require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const { terminate } = require("./utils/lib");
//////////////////////////////////////////////////////////////////

/** unhandled (sync) exceptions handler */
process.on("uncaughtException", (err) => terminate(err));
//////////////////////////////////////////////////////////////////

/** database config */

// remote database
const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// local database
// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then((conn) => console.log(`DB connected to: ${conn.connections[0].name}`));
//////////////////////////////////////////////////////////////////

/** server config */

const server = app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
//////////////////////////////////////////////////////////////////

/** unhandled (async) rejections handler */
process.on("unhandledRejection", (err) => terminate(err, server));
