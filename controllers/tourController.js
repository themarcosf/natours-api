const multer = require("multer");
const sharp = require("sharp");

const {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("./../utils/factoryHandlers");
const Tour = require("./../models/tourModel");
const { CustomError, asyncHandler } = require("../utils/lib");
////////////////////////////////////////////////////////////////////////

/** ALIAS MIDDLEWARE: provides a route for specific queries */
exports.aliasTop5 = function (req, res, next) {
  req.query.sort = "-ratingsAverage,price,-maxGroupSize";
  req.query.limit = 5;
  next();
};
////////////////////////////////////////////////////////////////////////

/**
 * AGGREGATION PIPELINES: define a pipeline that all documents from a collection go
 * through to be proccessed and transformed into aggregated results eg average, min, max, ...
 *
 * function param: stages[]
 */
exports.getStats = asyncHandler(async function (req, res, next) {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: "$difficulty" },
        results: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { results: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  if (!stats) return next(new CustomError("ID not found", 404));

  res
    .status(200)
    .json({
      status: "success",
      data: { stats },
    })
    .end();
});

exports.getSchedule = asyncHandler(async function (req, res, next) {
  const _year = Number(req.params.year);
  const schedule = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${_year}-01-01`),
          $lte: new Date(`${_year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        results: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: false },
    },
    {
      $sort: { month: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  if (!schedule) return next(new CustomError("No tour found", 404));

  res
    .status(200)
    .json({
      status: "success",
      year: _year,
      data: { schedule },
    })
    .end();
});
////////////////////////////////////////////////////////////////////////

/** GEOLOCATION QUERIES */

exports.geolocation = asyncHandler(async function (req, res, next) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const [earthRadiusMi, earthRadiusKm] = [3963.2, 6378.1];
  const radius =
    unit === "mi" ? distance / earthRadiusMi : distance / earthRadiusKm;

  if (!lat || !lng)
    return next(new CustomError("Coordinates are required", 400));

  const _tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({
      status: "success",
      results: _tours.length,
      data: { data: _tours },
    })
    .end();
});

exports.distances = asyncHandler(async function (req, res, next) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const _multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng)
    return next(new CustomError("coordinates are required", 400));

  const _distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        distanceField: "distance",
        distanceMultiplier: _multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res
    .status(200)
    .json({
      status: "success",
      data: { data: _distances },
    })
    .end();
});
////////////////////////////////////////////////////////////////////////

/**
 * EXAMPLE : config multer upload middleware to save image to disk
 *
 * const multerStorage = multer.diskStorage({
 *   destination: (req, file, cb) => {
 *     cb(null, "public/img/users");
 *   },
 *   filename: (req, file, cb) => {
 *     const ext = file.mimetype.split("/")[1];
 *     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
 *   },
 * });
 */

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new CustomError("Not an image! Please upload only images.", 400), false);
  }
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

/**
 * upload single image to single field : multerUpload.single() -> req.file
 * upload multiple images to single field : multerUpload.array() -> req.files
 * upload multiple images to multiple fields : multerUpload.fields() -> req.files
 */
exports.uploadMultipleImages = multerUpload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeMultipleImages = asyncHandler(async function (req, res, next) {
  if (!req.files.imageCover || !req.files.images) return next();

  /** cover image processing */
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  /** regular images processing */
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const _filename = `tour-${req.params.id}-${Date.now()}-${i++}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${_filename}`);
      req.body.images.push(_filename);
    })
  );

  next();
});
////////////////////////////////////////////////////////////////////////

/** CRUD handlers */

exports.createNewTour = createOne(Tour);
exports.getTour = readOne(Tour, { path: "reviews" }); // @dev 'select' property may be used
exports.getAllTours = readAll(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);
