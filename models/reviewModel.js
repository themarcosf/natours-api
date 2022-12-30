const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review cannot be empty"],
      maxLength: [500, "maximum length is 500 characters"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: 0,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "tour is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
//////////////////////////////////////////////////////////////////////////////////////

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
