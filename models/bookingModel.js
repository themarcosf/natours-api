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
//////////////////////////////////////////////////////////////////////////////////////

/** mongoose format: BSON */
const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "TourId is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    paid: {
      type: Boolean,
      default: true,
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

/** Query pre-hook middleware : regex /^param/ applies to any expression starting with param */
bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({ path: "tour", select: "name" });
  next();
});

//////////////////////////////////////////////////////////////////////////////////////

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
