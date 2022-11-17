const Tour = require("./../models/tourModel");
////////////////////////////////////////////////////////////////////////

// ROUTE HANDLERS
exports.getAllTours = function (req, res) {
  res
    .status(200)
    .json({
      status: "success",
      results: "<results>",
      time: req.requestTime,
      data: {},
    })
    .end();
};

exports.getTour = function (req, res) {
  res
    .status(200)
    .json({
      status: "success",
      data: { tour: "<tour>" },
    })
    .end();
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

exports.updateTour = function (req, res) {
  res
    .status(200)
    .json({
      status: "Success",
      data: "<updated tour>",
    })
    .end();
};

exports.deleteTour = function (req, res) {
  res
    .status(204)
    .json({
      status: "Success",
      data: null,
    })
    .end();
};
