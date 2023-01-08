const express = require("express");
const reviewRouter = require("./reviewRouter");
const authController = require("./../controllers/authController");
const tourController = require("./../controllers/tourController");

const router = express.Router();

/**
 * @example param middleware
 * router.param("name", [callback function (req, res, next, val)] );
 */

// @notice mount-nested-routes middleware
router.use("/:tourId/reviews", reviewRouter);

// @notice aliasing a frequently requested route
router.route("/top5").get(tourController.aliasTop5, tourController.getAllTours);

// @notice aggregation pipelines
router.route("/stats").get(tourController.getStats);
router.route("/schedule/:year").get(tourController.getSchedule);

// routes middleware
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
