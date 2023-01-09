const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

/**
 * @example param middleware
 * router.param("name", [callback function (req, res, next, val)] );
 */

// @notice data management middleware
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.authenticate,
  authController.updatePassword
);

// @notice routes middleware
router
  .route("/")
  .get(
    authController.authenticate,
    authController.authorization("admin"),
    userController.getAllUsers
  )
  .post(
    authController.authenticate,
    authController.authorization("admin"),
    userController.createUser
  );

router
  .route("/currentUser")
  .patch(authController.authenticate, userController.updateCurrentUser)
  .delete(authController.authenticate, userController.deleteCurrentUser);

router.get(
  "/me",
  authController.authenticate,
  userController.readCurrentUser,
  userController.getUser
);

router
  .route("/:id")
  .get(
    authController.authenticate,
    authController.authorization("admin"),
    userController.getUser
  )
  .patch(
    authController.authenticate,
    authController.authorization("admin"),
    userController.updateUser
  )
  .delete(
    authController.authenticate,
    authController.authorization("admin"),
    userController.deleteUser
  );

module.exports = router;
