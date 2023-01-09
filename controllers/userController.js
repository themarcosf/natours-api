const User = require("./../models/userModel");
const {
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("./../utils/factoryHandlers");
const { CustomError, asyncHandler, filterData } = require("../utils/lib");

// @notice route handlers
exports.readCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateCurrentUser = asyncHandler(async function (req, res, next) {
  // create error if attempt to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new CustomError("Attempted to update password", 400));
  }

  // filter user-provided data fields
  const _filteredData = filterData(req.body, "name", "email");

  // update user document
  const _updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    _filteredData,
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .json({
      status: "success",
      data: {
        user: _updatedUser,
      },
    })
    .end();
});

exports.deleteCurrentUser = asyncHandler(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, {
    status: "inactive",
    active: false,
  });

  res
    .status(204)
    .json({
      status: "success",
      data: null,
    })
    .end();
});

exports.getUser = readOne(User);
exports.getAllUsers = readAll(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
