const {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("./../utils/factoryHandlers");
const Review = require("./../models/reviewModel");
////////////////////////////////////////////////////////

// @notice route handlers

exports.createReview = createOne(Review);
exports.getReview = readOne(Review);
exports.getAllReviews = readAll(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);

////////////////////////////////////////////////////////

// @notice setup middleware
exports.setProperties = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
