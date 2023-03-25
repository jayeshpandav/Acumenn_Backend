// Importing required dependencies
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // Loading environment variables

// importing cors middleware
const cors = require("cors");

// Creating an express app
const app = express();
app.use(cors());

// Parsing incoming requests with JSON payloads
app.use(express.json());

// Importing routes for investments and withdrawals
const investments = require("./routes/investmentRoutes");
const withdrawals = require("./routes/withdrawalRoutes");

// Mounting routes on specific URLs
app.use("/api/investment", investments);
app.use("/api/withdrawals", withdrawals);

// Setting up the server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`http://localhost:${port}`);
});
