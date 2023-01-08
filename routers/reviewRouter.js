const express = require("express");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

// @dev mergeParms default: false
const router = express.Router({ mergeParams: true });

/**
 * routes middleware
 */
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.authenticate,
    authController.authorization("user"),
    reviewController.createReview
  );

module.exports = router;
