const app = require("express")();

app.get("/", (req, res) =>
  res
    .status(200)
    .json({ status: "Sucess", data: { type: "GET Request", app: "Natours" } })
    .end()
);

app.post("/", (req, res) =>
  res
    .status(200)
    .json({ status: "Success", data: { type: "POST Request", app: "Natours" } })
    .end()
);

app.listen(8000, "127.0.0.1", () => console.log("Server running on port 8000"));
