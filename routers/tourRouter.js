const express = require("express");
const reviewRouter = require("./reviewRouter");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

/**
 * @example param middleware
 * router.param("name", [callback function (req, res, next, val)] );
 */

// @notice mount-nested-routes middleware
router.use("/:tourId/reviews", reviewRouter);

// @notice aliasing a frequently requested route
router.get("/top5", tourController.aliasTop5, tourController.getAllTours);

// @notice aggregation pipelines
router.get("/stats", tourController.getStats);
router.get(
  "/schedule/:year",
  authController.authenticate,
  authController.authorization("admin", "lead-guide", "guide"),
  tourController.getSchedule
);

// @notice routes middleware
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.authenticate,
    authController.authorization("admin", "lead-guide"),
    tourController.createNewTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.authenticate,
    authController.authorization("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.authenticate,
    authController.authorization("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
