const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

/**
 * @example param middleware
 * router.param("name", [callback function (req, res, next, val)] );
 */

// @notice routes middleware
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// @notice authentication required for all routes after this middleware
router.use(authController.authenticate);

router.patch("/updatePassword", authController.updatePassword);

router
  .route("/currentUser")
  .patch(userController.updateCurrentUser)
  .delete(userController.deleteCurrentUser);

router.get("/me", userController.readCurrentUser, userController.getUser);

// @notice authorization required for all routes after this middleware
router.use(authController.authorization("admin"));

router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
