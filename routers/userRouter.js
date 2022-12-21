const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

/**
 * EXAMPLE: param middleware
 * router.param("name", [callback function (req, res, next, val)] );
 */

/**
 * data management middleware
 */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.authenticate,
  authController.updatePassword
);
router.patch(
  "/updateCurrentUser",
  authController.authenticate,
  userController.updateCurrentUser
);

/**
 * general purpose middleware
 */
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
