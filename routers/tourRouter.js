const express = require("express");

const reviewRouter = require("./reviewRouter");
const authController = require("./../controllers/authController");
const tourController = require("./../controllers/tourController");

const router = express.Router();

/** mount-nested-routes middleware */
router.use("/:tourId/reviews", reviewRouter);

/** aliasing a frequently requested route */ 
router.get("/top5", tourController.aliasTop5, tourController.getAllTours);

/** aggregation pipelines */
router.get("/stats", tourController.getStats);
router.get(
  "/schedule/:year",
  authController.authenticate,
  authController.authorization("admin", "lead-guide", "guide"),
  tourController.getSchedule
);

/** geolocation queries */
router.get(
  "/geolocation/:distance/center/:latlng/unit/:unit",
  tourController.geolocation
);

router.get("/distances/:latlng/unit/:unit", tourController.distances);

/** routes middleware */ 
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
