/**
 * OPPORTUNITIES FOR IMPROVEMENT
 *
 * better descriptions for mongoDB and mongoose errors
 * define different error severity levels eg low, medium, high, critical
 * email systems administrator about critical errors
 */

const devError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  if (!req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};

const prodError = (err, req, res) => {
  /** operational errors from mongoDB and mongoose */
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError" ||
    err.code === 11000
  )
    err.isOperational = true;

  if (req.originalUrl.startsWith("/api")) {
    err.isOperational
      ? res
          .status(err.statusCode)
          .json({
            status: err.status,
            message: err.message,
            operational: err.isOperational,
          })
          .end()
      : unknownError(err, req, res);
  }

  if (!req.originalUrl.startsWith("/api")) {
    err.isOperational
      ? res.status(err.statusCode).render("error", {
          title: "Something went wrong!",
          msg: err.message,
        })
      : res.status(err.statusCode).render("error", {
          title: "Something went wrong!",
          msg: "Please try again later.",
        });
  }
};

const unknownError = (err, req, res) => {
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
    ? devError(err, req, res)
    : prodError(err, req, res);
};
