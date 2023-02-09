const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
////////////////////////////////////////////////////////////////////////

/** config express router */
const router = express.Router();

/** routes middleware */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

/** authentication required for all routes after this middleware */
router.use(authController.authenticate);

router.patch("/updatePassword", authController.updatePassword);

router
  .route("/currentUser")
  .patch(
    userController.uploadSingleImage,
    userController.resizeSingleImage,
    userController.updateCurrentUser
  )
  .delete(userController.deleteCurrentUser);

router.get("/me", userController.readCurrentUser, userController.getUser);

/** authorization required for all routes after this middleware */
router.use(authController.authorization("admin"));

router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
