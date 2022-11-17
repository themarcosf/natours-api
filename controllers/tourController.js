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

exports.createNewTour = function (req, res) {
  new Tour(req.body)
    .save()
    .then((doc) => {
      res
        .status(201)
        .json({
          status: "Success",
          data: { tour: doc },
        })
        .end();
    })
    .catch((err) => {
      res
        .status(400)
        .json({
          status: "Failed",
          data: { error: err },
        })
        .end();
    });
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
