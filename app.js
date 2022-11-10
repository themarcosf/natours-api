// core modules
const express = require("express");
const fs = require("fs");
////////////////////////////////////////////////////////////////////////

// data load
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, {
    encoding: "utf-8",
  })
);
////////////////////////////////////////////////////////////////////////

// SERVER
const app = express();

// middlewares
app.use(express.json()); //adds body to request

// routing [JSEND standard]
app.get("/api/v1/tours", (req, res) =>
  res
    .status(200)
    .json({
      status: "success",
      results: tours.length,
      data: { tours },
    })
    .end()
);

app.post("/api/v1/tours", (req, res) => {
  const _id = tours.at(-1).id + 1;
  const _tour = Object.assign({ id: _id }, req.body);
  tours.push(_tour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) =>
      res
        .status(201)
        .json({
          status: "Success",
          data: { tour: _tour },
        })
        .end()
  );
});

app.listen(8000, "127.0.0.1", () => console.log("Server running on port 8000"));
