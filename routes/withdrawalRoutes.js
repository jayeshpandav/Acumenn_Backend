// Importing required dependencies and controllers
const express = require("express");
const {
  numUntilDepleted, // Controller function for calculating the number of withdrawals until depletion
  totalWithdrawan, // Controller function for calculating the total amount withdrawn
} = require("../controllers/withdrawalController");

// Creating an express router
const router = express.Router();

// Defining routes for handling withdrawal-related requests
router.route("/swp/num_until_depleted").post(numUntilDepleted);
router.route("/swp/total_withdrawn/").post(totalWithdrawan);

// Exporting the router for use in other modules
module.exports = router;
