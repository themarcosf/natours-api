const express = require("express");

const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");
////////////////////////////////////////////////////////////////////////

/** mount route handler middleware */
const router = express.Router();

/** authentication required for all routes after this middleware */
router.use(authController.authenticate);

/** route to get Stripe checkout session */
router.get("/checkout-session/:tourId", bookingController.stripeCheckout);

module.exports = router;
