const fs = require("fs");

// data load
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, {
    encoding: "utf-8",
  })
);
////////////////////////////////////////////////////////////////////////

// ROUTE HANDLERS
exports.getAllUsers = function (req, res) {
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

exports.getUser = function (req, res) {
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

exports.createNewUser = function (req, res) {
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

exports.updateUser = function (req, res) {
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

exports.deleteUser = function (req, res) {
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
