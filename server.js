const app = require("./app");

const localhost = "127.0.0.1";
const port = 8000;

// server start
app.listen(port, localhost, () =>
  console.log(`Server running on port ${port}`)
);
