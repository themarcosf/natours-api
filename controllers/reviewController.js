const handler = require("./../utils/factoryHandlers");
const Review = require("./../models/reviewModel");
////////////////////////////////////////////////////////////////////////

/** setup middleware */
exports.setProperties = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
////////////////////////////////////////////////////////////////////////

/** CRUD handlers */
exports.createReview = handler.createOne(Review);
exports.getReview = handler.readOne(Review);
exports.getAllReviews = handler.readAll(Review);
exports.updateReview = handler.updateOne(Review);
exports.deleteReview = handler.deleteOne(Review);
