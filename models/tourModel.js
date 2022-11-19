const mongoose = require("mongoose");

// mongoose format: BSON
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required."],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "duration is required"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "maxGroupSize is required"],
  },
  difficulty: {
    type: String,
    required: [true, "difficulty is required"],
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "price is required."],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, "summary is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "description is required"],
  },
  imageCover: {
    type: String,
    required: [true, "imageCover is required"],
  },
  images: [String],
  startDates: {
    type: [Date],
    required: [true, "startDates is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
