const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

/*
EXAMPLE: param middleware
router.param("name", [callback function (req, res, next, val)] );
*/

// routes middleware
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
