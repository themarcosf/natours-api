const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const { CustomError } = require("./utils/lib");
const userRouter = require("./routers/userRouter");
const tourRouter = require("./routers/tourRouter");
const reviewRouter = require("./routers/reviewRouter");
const errController = require("./controllers/errController");
////////////////////////////////////////////////////////////////////////

const app = express();

/**
 * general purpose global middleware
 *
 * TODO : data sanitization against XSS eg xss or xss-clean
 * TODO : prevent http parameter pollution eg hpp
 */

// parse request body
app.use(express.json({ limit: "10kb" }));

// set security HTTP headers
app.use(helmet());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// serve static files
app.use(express.static(`${__dirname}/public`));

// http requests logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// block DoS attacks by counting number of request from single IP (eg 100 per hour)
app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "IP blocked",
  })
);

// boilerplate example
// app.use((req, res, next) => {
//   console.log(req.body);
//   next();
// });

/**
 * routers middleware
 */
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("/*", (req, res, next) =>
  next(new CustomError(`Invalid path: ${req.originalUrl}`, 404))
);

/**
 * global error handling middleware
 */
app.use(errController);

module.exports = app;
