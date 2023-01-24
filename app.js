const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const { CustomError } = require("./utils/lib");
const userRouter = require("./routers/userRouter");
const tourRouter = require("./routers/tourRouter");
const viewsRouter = require("./routers/viewsRouter");
const reviewRouter = require("./routers/reviewRouter");
const errController = require("./controllers/errController");
////////////////////////////////////////////////////////////////////////

const app = express();

/** template engine : express supports commom template engines out-of-the-box */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// serve static files
app.use(express.static(path.join(__dirname, "public")));

/** general purpose global middleware */

// parse request body
app.use(express.json({ limit: "10kb" }));

// set security HTTPS headers
// app.use(helmet());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

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

// TODO : data sanitization against XSS eg xss or xss-clean
// TODO : prevent http parameter pollution eg hpp

/** routers middleware */
app.use("/", viewsRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("/*", (req, res, next) =>
  next(new CustomError(`Invalid path: ${req.originalUrl}`, 404))
);

/** global error handling middleware */
app.use(errController);

module.exports = app;
