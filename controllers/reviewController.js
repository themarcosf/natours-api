const { asyncHandler } = require("../utils/lib");
const Review = require("./../models/reviewModel");
////////////////////////////////////////////////////////

/**
 * ROUTE HANDLERS
 */
exports.getAllReviews = asyncHandler(async function (req, res, next) {
  const _reviews = await Review.find();

  res
    .status(200)
    .json({
      status: "success",
      results: _reviews.length,
      data: { reviews: _reviews },
    })
    .end();
});

exports.createNewReview = asyncHandler(async function (req, res, next) {
  const _review = await Review.create(req.body);

  res
    .status(201)
    .json({
      status: "Success",
      data: { review: _review },
    })
    .end();
});
