/**
 * OPPORTUNITIES FOR IMPROVEMENT
 *
 * better descriptions for mongoDB and mongoose errors
 * define different error severity levels eg low, medium, high, critical
 * email systems administrator about critical errors
 */

const devError = (err, res) =>
  res
    .status(err.statusCode)
    .json({
      status: err.status,
      stack: err.stack,
      message: err.message,
    })
    .end();

const prodError = (err, res) => {
  // operational errors from mongoDB and mongoose
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.code === 11000
  )
    err.isOperational = true;

  err.isOperational
    ? res
        .status(err.statusCode)
        .json({
          status: err.status,
          message: err.message,
        })
        .end()
    : unknownError(err, res);
};

const unknownError = (err, res) => {
  console.error(`💥 ERROR: ${err}`);
  return res
    .status(500)
    .json({
      status: "Error",
      message: "Unknown error",
    })
    .end();
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  process.env.NODE_ENV === "development"
    ? devError(err, res)
    : prodError(err, res);
};
