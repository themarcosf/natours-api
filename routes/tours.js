const fs = require("fs");

// data load
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, {
    encoding: "utf-8",
  })
);
////////////////////////////////////////////////////////////////////////

// ROUTE HANDLERS
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
  const _id = req.params.id;

  _id > tours.at(-1).id
    ? res
        .status(404)
        .json({
          status: "fail",
          message: "Invalid ID",
        })
        .end()
    : res
        .status(200)
        .json({
          status: "success",
          data: { tour: tours.find((el) => String(el.id) === _id) },
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
  console.log(req.params);
  console.log(req.body);

  req.params.id > tours.at(-1).id
    ? res
        .status(404)
        .json({
          status: "fail",
          message: "Invalid ID",
        })
        .end()
    : res
        .status(200)
        .json({
          status: "Success",
          data: "<updated tour>",
        })
        .end();
};

exports.deleteTour = function (req, res) {
  console.log(req.params);

  req.params.id > tours.at(-1).id
    ? res
        .status(404)
        .json({
          status: "fail",
          message: "Invalid ID",
        })
        .end()
    : res
        .status(204)
        .json({
          status: "Success",
          data: null,
        })
        .end();
};
