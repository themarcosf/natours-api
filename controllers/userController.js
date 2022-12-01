const { asyncHandler } = require("../utils/lib");
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
