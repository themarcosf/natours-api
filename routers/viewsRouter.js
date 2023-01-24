const express = require("express");
const viewsController = require("./../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.overview);

router.get("/tour/:slug", viewsController.tour);

module.exports = router;
