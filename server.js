// const app = require("./app");
// require("dotenv").config();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log("Server running on http://localhost:" + PORT);
// });

const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

mongoose.set("strictQuery", true);
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.DB_URI)
  .then(app.listen(PORT, () => console.log("Server running")))
  .catch((err) => {
    console.log(err.message);
    process.exit();
  });
