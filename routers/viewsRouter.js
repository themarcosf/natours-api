const express = require("express");

const authController = require("./../controllers/authController");
const viewsController = require("./../controllers/viewsController");
const bookingController = require("./../controllers/bookingController");
//////////////////////////////////////////////////////////////////

const router = express.Router();

/** authenticate: check for jwt in cookie AND header */
router.get("/me", authController.authenticate, viewsController.userAccount);
router.get(
  "/my-tours",
  authController.authenticate,
  viewsController.scheduledTours
);

/** login : check for jwt in cookie only */
router.use(authController.checkLogin);

/** routes middleware */
router.get(
  "/",
  bookingController.createBookingStripe,
  viewsController.overview
);
router.get("/login", viewsController.login);
router.get("/tour/:slug", viewsController.tour);

module.exports = router;
