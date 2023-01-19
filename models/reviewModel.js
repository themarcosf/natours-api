/**
 * IMPORTANT CAVEAT ABOUT MONGOOSE CUSTOM DATA VALIDATORS:
 *
 * inside a validator function (eg images) the THIS keyword
 * is only gonna point to the current document when a NEW document
 * is being created ie POST request
 *
 * that is not true when UPDATING a document ie PATCH request
 */
const mongoose = require("mongoose");
const Tour = require("./tourModel");

// mongoose format: BSON
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

/**
 * Static methods: available directly in the Model
 *
 * calcAverageRatings: update Tour average rating whenever a Review is handled
 */
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].numRatings,
    ratingsAverage: stats[0].avgRating,
  });
};

// @notice call static method before new review is stored in database
// @dev this.constructor : enable using Review model before declaring it
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});
//////////////////////////////////////////////////////////////////////////////////////

/** Query pre-hook middleware : regex /^param/ applies to any expression starting with param */
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
