const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

/*
EXAMPLE: param middleware
router.param("name", [callback function (req, res, next, val)] );
*/

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
