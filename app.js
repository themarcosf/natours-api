const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routers/userRouter");
const tourRouter = require("./routers/tourRouter");
////////////////////////////////////////////////////////////////////////

const app = express();

// middlewares
app.use(express.json()); // parses request body
app.use(express.static(`${__dirname}/public`)); //serves static files
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV == "development") app.use(morgan("dev")); // http requests logger

// routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
