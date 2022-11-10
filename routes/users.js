const fs = require("fs");

// data load
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, {
    encoding: "utf-8",
  })
);
////////////////////////////////////////////////////////////////////////

// ROUTE HANDLERS
exports.getAllUsers = function (req, res) {};

exports.getUser = function (req, res) {};

exports.createNewUser = function (req, res) {};

exports.updateUser = function (req, res) {};

exports.deleteUser = function (req, res) {};
