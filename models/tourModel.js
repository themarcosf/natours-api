const mongoose = require("mongoose");
const slugify = require("slugify");

// mongoose format: BSON
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required."],
      trim: true,
      unique: true,
    },
    slug: String,
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
      select: false, //used to permanently hide sensitive data from clients
    },
    vip: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//////////////////////////////////////////////////////////////////////////////////////

/*
Virtual Properties: 
enables separation between business logic and application logic
derivative fields not to be persisted in the database
eg conversion from mph to kph or days to weeks

cannot be used in queries eg Tour.find( $where: { durationWeeks: 1 })
*/
tourSchema.virtual("durationWeeks").get(function () {
  return Math.ceil(this.duration / 7);
});
//////////////////////////////////////////////////////////////////////////////////////

/*
Document middleware: 
pre-hook: triggered before the event command [.save() or .create()]
post-hook: triggered after the event command
*/
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.start = Date.now();
  next();
});

tourSchema.post("save", function (doc, next) {
  console.log(`Command clock: ${Date.now() - this.start} ms`);
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

/*
Query middleware: triggered before or after a certain query
*/
tourSchema.pre(/^find/, function (next) {
  this.find({ vip: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query clock: ${Date.now() - this.start} ms`);
  next();
});
//////////////////////////////////////////////////////////////////////////////////////

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
