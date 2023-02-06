const express = require("express");

const viewsController = require("./../controllers/viewsController");
const authController = require("./../controllers/authController");
//////////////////////////////////////////////////////////////////

const router = express.Router();

router.get("/me", authController.authenticate, viewsController.userAccount);

/** login check required for all pages rendered after this middleware */
router.use(authController.checkLogin);

/** routes middleware */
router.get("/", viewsController.overview);
router.get("/login", viewsController.login);
router.get("/tour/:slug", viewsController.tour);

module.exports = router;
