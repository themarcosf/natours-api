// environment variables
require("dotenv").config({ path: "./config.env" });
//////////////////////////////////////////////////////////////////

// database
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((conn) => console.log(`DB connected to: ${conn.connections[0].name}`));

/*
REMINDER: deprecation warnings
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}
*/
//////////////////////////////////////////////////////////////////

// server
const app = require("./app");

app.listen(process.env.PORT || 8000, process.env.HOST || "127.0.0.1", () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
//////////////////////////////////////////////////////////////////
