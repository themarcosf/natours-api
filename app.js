const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
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

/**
 * cross origin resource sharing
 * simple requests : GET, POST
 * non-simple requests : PUT, PATCH, DELETE, embedded cookies, non-standard headers, ...
 * pre-flight phase : browser issues special OPTIONS request before submitting actual request
 */
app.use(cors());
app.options("*", cors());

/** serve static files */
app.use(express.static(path.join(__dirname, "public")));

/** parse request body */
app.use(express.json({ limit: "10kb" }));

/** parse request cookies */
app.use(cookieParser());

/** parse data coming from an HTML form */
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/** set security HTTPS headers [disabled due to incompatibility with PUG] */
// app.use(helmet());

/** data sanitization against NoSQL query injection */
app.use(mongoSanitize());

/** http requests logger */
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/** block DoS attacks by counting number of request from single IP (eg 100 per hour) */
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

/** global invalid path handler */
app.all("/*", (req, res, next) =>
  next(new CustomError(`Invalid path: ${req.originalUrl}`, 404))
);

/** global error handling middleware */
app.use(errController);

module.exports = app;
