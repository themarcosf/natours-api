const { CustomError, asyncHandler, filterData } = require("../utils/lib");
const User = require("./../models/userModel");

// ROUTE HANDLERS
exports.getAllUsers = asyncHandler(async function (req, res, next) {
  const _data = await User.find();

  res
    .status(200)
    .json({
      status: "success",
      results: _data.length,
      data: {
        users: _data,
      },
    })
    .end();
});

exports.getUser = function (req, res, next) {
  res
    .status(500)
    .json({
      status: "Error",
      data: {
        message: "TODO",
      },
    })
    .end();
};

exports.createUser = function (req, res, next) {
  res
    .status(500)
    .json({
      status: "Error",
      data: {
        message: "TODO",
      },
    })
    .end();
};

exports.updateUser = function (req, res, next) {
  res
    .status(500)
    .json({
      status: "Error",
      data: {
        message: "TODO",
      },
    })
    .end();
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

exports.deleteUser = function (req, res, next) {
  res
    .status(500)
    .json({
      status: "Error",
      data: {
        message: "TODO",
      },
    })
    .end();
};

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
