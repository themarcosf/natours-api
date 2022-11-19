/*
EXPLANATION: queries in mongoose

1. methods of the Model object (eg Model.find()) return instances of the Query object
2. instances of the Query object (Query.prototype.*) use chainable methods
3. async/await executes the query immediately and return the documents that match the query

      = SOLUTION
      . first store the query in a temporary variable (const _query)
      . chain all necessary methods in a final variable (const query)
      . await the final query only after chaining 
*/
////////////////////////////////////////////////////////////////////////

const Tour = require("./../models/tourModel");

const _queryParams = ["page", "sort", "limit", "fields"];

// ROUTE HANDLERS
exports.getAllTours = async function (req, res) {
  let query;
  try {
    // filtering
    const _query = JSON.parse(
      JSON.stringify({ ...req.query }).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );
    _queryParams.forEach((el) => delete _query[el]);
    query = Tour.find(_query);

    // sorting: enables users to sort the results
    //      sort=field : ascending order
    //      sort=-field : descending order
    //      sort=field1,field2,... : multiple criteria
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // execute query
    const _tours = await query;

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
