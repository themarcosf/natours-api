const { asyncHandler } = require("../utils/lib");
const Review = require("./../models/reviewModel");
////////////////////////////////////////////////////////

// ROUTE HANDLERS
exports.getAllReviews = asyncHandler(async function (req, res, next) {
  let _filter = {};
  if (req.params.tourId) _filter = { tour: req.params.tourId };

  const _reviews = await Review.find(_filter);

  res
    .status(200)
    .json({
      status: "success",
      results: _reviews.length,
      data: { reviews: _reviews },
    })
    .end();
});

exports.createReview = asyncHandler(async function (req, res, next) {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const _review = await Review.create(req.body);

  res
    .status(201)
    .json({
      status: "Success",
      data: { review: _review },
    })
    .end();
});
