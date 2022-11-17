const mongoose = require("mongoose");

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
  },
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
