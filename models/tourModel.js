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
const slugify = require("slugify");

// mongoose format: BSON
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxlength: [40, "lengthmax is 40 digits"],
      minlength: [10, "lengthmin is 10 digits"],
      trim: true,
      unique: true,
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, "difficulty is required"],
      maxlength: [10, "lengthmax is 10 digits"],
      minlength: [4, "lengthmin is 4 digits"],
      trim: true,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "invalid difficulty",
      },
    },
    summary: {
      type: String,
      required: [true, "summary is required"],
      maxlength: [250, "lengthmax is 250 digits"],
      minlength: [25, "lengthmin is 25 digits"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxlength: [5000, "lengthmax is 5000 digits"],
      minlength: [25, "lengthmin is 25 digits"],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "imageCover is required"],
      maxlength: [20, "lengthmax is 20 digits"],
      minlength: [4, "lengthmin is 4 digits"],
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          let _isValid;
          val.forEach((el) => {
            if (el !== el.trim() || el.length < 4 || el.length > 20)
              _isValid = false;
          });
          return _isValid;
        },
        message: "invalid path: {VALUE}",
      },
    },
    duration: {
      type: Number,
      required: [true, "duration is required"],
      min: [1, "duration must be above 1"],
      max: [90, "duration must be below 90"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "maxGroupSize is required"],
      min: [1, "maxGroupSize must be above 1"],
      max: [40, "maxGroupSize must be below 40"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above or equat to 1.0"],
      max: [5, "Rating must be below or equal to 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required."],
      min: [10, "price must be above 10"],
      max: [10000, "price must be below 10000"],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      min: [0, "priceDiscount must be above 0"],
      max: [1, "priceDiscount must be below 1"],
    },
    startDates: {
      type: [Date],
      required: [true, "startDates is required"],
    },
    /**
     * mongoDB supports geospatial data coords
     * standard: GeoJSON [long, lat]
     */
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    vip: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //used to permanently hide sensitive data from clients
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//////////////////////////////////////////////////////////////////////////////////////

/* Indexes : allow for more efficient data queries */

tourSchema.index({ slug: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Virtual Properties:
 * enables separation between business logic and application logic
 * derivative fields not to be persisted in the database
 * eg conversion from mph to kph or days to weeks
 * eg virtual populate not to be persisted
 *
 * cannot be manipulated in queries eg Tour.find( $where: { durationWeeks: 1 })
 */
tourSchema.virtual("durationWeeks").get(function () {
  return Math.ceil(this.duration / 7);
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Middlewares:
 * types: document, query, aggregation, model
 * pre-hooks: triggered before the event command
 * post-hooks: triggered after the event command
 *
 * CAVEAT: document middlewares are used for .save() or .create()
 *         they do NOT work for .update() functions
 */
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.start = Date.now();
  next();
});

/**
 * @dev example : embed guides into Tour document
 *
 * in tourSchema >> guides: Array
 *
 * tourSchema.pre("save", async function (next) {
 * // loop through guides array and get user documents
 * const _guidesPromises = this.guides.map(async (el) => await User.findById(el));
 * // overwrite guides array with user documents
 * this.guides = await Promise.all(_guidesPromises);
 * next();
 * });
 */

tourSchema.post("save", function (doc, next) {
  console.log(`Document middleware clock: ${Date.now() - this.start} ms`);
  next();
});

/* @dev populate and select guide reference in Tour document */
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v +role",
  });
  next();
});

// regex /^param/ : any expression starting with param
tourSchema.pre(/^find/, function (next) {
  this.find({ vip: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query middleware clock: ${Date.now() - this.start} ms`);
  next();
});

tourSchema.pre("aggregate", function (next) {
  this._pipeline.unshift({ $match: { vip: { $ne: true } } });
  next();
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
