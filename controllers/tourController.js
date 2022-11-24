const { QueryHelpers } = require("../utils/lib");
const Tour = require("./../models/tourModel");
////////////////////////////////////////////////////////

/*
ALIAS MIDDLEWARE: provides a route for specific queries
*/
exports.aliasTop5 = function (req, res, next) {
  req.query.sort = "-ratingsAverage,price,-maxGroupSize";
  req.query.limit = 5;
  next();
};
////////////////////////////////////////////////////////

/*
ROUTE HANDLERS
*/
exports.getAllTours = async function (req, res) {
  try {
    const query = new QueryHelpers(req.query, Tour.find())
      .filter()
      .sort()
      .fields()
      .paginate();
    const _tours = await query.mongooseQuery;

    res
      .status(200)
      .json({
        status: "success",
        results: _tours.length,
        data: { _tours },
      })
      .end();
  } catch (err) {
    res
      .status(404)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};

exports.getTour = async function (req, res) {
  try {
    const _tour = await Tour.findById(req.params.id);
    res
      .status(200)
      .json({
        status: "success",
        data: { _tour },
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};

exports.createNewTour = async function (req, res) {
  try {
    const _tour = await Tour.create(req.body);
    res
      .status(201)
      .json({
        status: "Success",
        data: { tour: _tour },
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "Fail",
        message: err,
      })
      .end();
  }
};

exports.updateTour = async function (req, res) {
  try {
    const _tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({
        status: "sucess",
        data: { _tour },
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({
        status: "sucess",
        data: null,
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};
////////////////////////////////////////////////////////

/*
AGGREGATION PIPELINES: define a pipeline that all documents from a collection go
through to be proccessed and transformed into aggregated results eg average, min, max, ...

function param: stages[]
*/
exports.getStats = async function (req, res) {
  try {
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

    res
      .status(200)
      .json({
        status: "success",
        data: { stats },
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};

exports.getSchedule = async function (req, res) {
  try {
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

    res
      .status(200)
      .json({
        status: "success",
        year: _year,
        data: { schedule },
      })
      .end();
  } catch (err) {
    res
      .status(400)
      .json({
        status: "fail",
        message: err,
      })
      .end();
  }
};
