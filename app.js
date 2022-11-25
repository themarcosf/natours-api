const express = require("express");
const morgan = require("morgan");
const { CustomError } = require("./utils/lib");
const errorHandler = require("./controllers/errController");
const userRouter = require("./routers/userRouter");
const tourRouter = require("./routers/tourRouter");
////////////////////////////////////////////////////////////////////////

const app = express();

// general purpose middleware
app.use(express.json()); // parses request body
app.use(express.static(`${__dirname}/public`)); //serves static files
if (process.env.NODE_ENV === "development") app.use(morgan("dev")); // http requests logger

// routers middleware
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("/*", (req, res, next) =>
  next(new CustomError(`Invalid path: ${req.originalUrl}`, 404))
);

// global error handling middleware
app.use(errorHandler);

module.exports = app;
