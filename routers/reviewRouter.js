const express = require("express");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

// @dev mergeParms default: false
const router = express.Router({ mergeParams: true });

// @notice routes middleware
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.authenticate,
    authController.authorization("user"),
    reviewController.setProperties,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.authenticate,
    authController.authorization("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.authenticate,
    authController.authorization("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
