const express = require("express");
const Tours = require("./routes/tours");
const Users = require("./routes/users");
const morgan = require("morgan");
////////////////////////////////////////////////////////////////////////

// SERVER
const app = express();
const localhost = "127.0.0.1";
const port = 8000;

// middlewares
app.use(express.json()); // adds body to request
app.use(morgan("dev")); // http requests logger
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// tours routes
app.route("/api/v1/tours").get(Tours.getAllTours).post(Tours.createNewTour);
app
  .route("/api/v1/tours/:id")
  .get(Tours.getTour)
  .patch(Tours.updateTour)
  .delete(Tours.deleteTour);

// users routes
app.route("/api/v1/users").get(Users.getAllUsers).post(Users.createNewUsers);
app
  .route("/api/v1/users/:id")
  .get(Users.getUsers)
  .patch(Users.updateUsers)
  .delete(Users.deleteUsers);

// server start
app.listen(port, localhost, () =>
  console.log(`Server running on port ${port}`)
);
