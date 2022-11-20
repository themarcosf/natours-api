const API = require("../utils/API");
const Tour = require("./../models/tourModel");

// ALIAS MIDDLEWARE
exports.aliasTop5 = function (req, res, next) {
  req.query.sort = "-ratingsAverage,price,-maxGroupSize";
  req.query.limit = 5;
  next();
};

// ROUTE HANDLERS
exports.getAllTours = async function (req, res) {
  try {
    const query = new API(req.query, Tour.find())
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
