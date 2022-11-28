const devError = (err, res) =>
  res
    .status(err.statusCode)
    .json({
      stack: err.stack,
      operational: err.isOperational,
    })
    .end();

const prodError = (err, res) =>
  err.isOperational
    ? res
        .status(err.statusCode)
        .json({
          status: err.status,
          message: err.message,
        })
        .end()
    : unknownError(err, res);

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
