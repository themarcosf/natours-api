const fs = require("fs");

// data load
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, {
    encoding: "utf-8",
  })
);
////////////////////////////////////////////////////////////////////////

// ROUTE HANDLERS
exports.checkId = function (req, res, next, val) {
  if (val > tours.at(-1).id) {
    return res
      .status(404)
      .json({
        status: "fail",
        message: "Invalid ID",
      })
      .end();
  }
  next();
};

exports.getAllTours = function (req, res) {
  res
    .status(200)
    .json({
      status: "success",
      results: tours.length,
      time: req.requestTime,
      data: { tours },
    })
    .end();
};

exports.getTour = function (req, res) {
  res
    .status(200)
    .json({
      status: "success",
      data: { tour: tours.find((el) => String(el.id) === req.params.id) },
    })
    .end();
};

exports.createNewTour = function (req, res) {
  const _tour = Object.assign({ id: tours.at(-1).id + 1 }, req.body);
  tours.push(_tour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) =>
      res
        .status(201)
        .json({
          status: "Success",
          data: { tour: _tour },
        })
        .end()
  );
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
