const express = require("express");
const Routes = require("./routes");
////////////////////////////////////////////////////////////////////////

// SERVER
const app = express();
const localhost = "127.0.0.1";
const port = 8000;

// middlewares
app.use(express.json()); //adds body to request

// routes
app.route("/api/v1/tours").get(Routes.getAllTours).post(Routes.createNewTour);
app
  .route("/api/v1/tours/:id")
  .get(Routes.getTour)
  .patch(Routes.updateTour)
  .delete(Routes.deleteTour);

app.listen(port, localhost, () =>
  console.log(`Server running on port ${port}`)
);
