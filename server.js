const app = require("./app");
require("dotenv").config();

const PORT = process.env.DB_URI || 3000;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
