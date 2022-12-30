const express = require("express");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();

/**
 * routes middleware
 */
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.authenticate,
    authController.authorization("user"),
    reviewController.createNewReview
  );

module.exports = router;
