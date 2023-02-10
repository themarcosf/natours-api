const jwt = require("jsonwebtoken");
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @property isOperational : distinguish operational error from other unknown errors
 *
 * Error.captureStackTrace : creates the stack property on Error instance
 * @param this : target object
 * @param this.constructor : error class
 */
class CustomError extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
    this.status = String(this.statusCode).startsWith(4) ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////

/** handles uncaught (sync) exceptions and (async) rejections */
const terminate = function (err, server) {
  console.log(err.name, err.message);
  if (server) server.close();
  process.exit(-1);
};
//////////////////////////////////////////////////////////////////////////////////////////////////

const filterData = function (data, ...filters) {
  const _filteredData = {};
  Object.keys(data).forEach((el) => {
    if (filters.includes(el)) _filteredData[el] = data[el];
  });
  return _filteredData;
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * wrapper function to catch errors in async functions
 *
 * @param {function} fn
 * @returns void
 */
const asyncHandler = function (fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {mongoDB _id} userId
 * @returns token
 */
const jwtTokenGenerator = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/** httpOnly : makes impossible to manipulate cookie in browser */
const setupResponse = function (_user, _statusCode, _res) {
  const _token = jwtTokenGenerator(_user._id);
  const _options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") _options.secure = true;

  _res.cookie("jwt", _token, _options);

  return _res
    .status(_statusCode)
    .json({
      status: "success",
      token: _token,
      data: {
        name: _user.name,
        email: _user.email,
      },
    })
    .end();
};
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  CustomError,
  terminate,
  filterData,
  asyncHandler,
  jwtTokenGenerator,
  setupResponse,
};
