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
  .then((con) => console.log(`DB connected to: ${con.connections[0].name}`));

// {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required."],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Tour price is required."],
  },
  rating: {
    type: Number,
    default: 4.5,
    required: [true, "Tour rating is required."],
  },
});

const Tour = new mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "The Park Camper",
  price: 997,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));
//////////////////////////////////////////////////////////////////

// server
const app = require("./app");

app.listen(process.env.PORT || 8000, process.env.HOST || "127.0.0.1", () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
//////////////////////////////////////////////////////////////////
