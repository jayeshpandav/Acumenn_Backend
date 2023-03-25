// Importing required dependencies and controllers
const express = require("express");
const {
  reqSip, // Controller function for handling SIP investment requests
  swpWithdrawal, // Controller function for handling SWP withdrawal requests
} = require("../controllers/investmentControllers");

// Creating an express router
const router = express.Router();

// Defining routes for handling SIP and SWP requests
router.route("/sip/required").post(reqSip);
router.route("/swp/withdrawals").post(swpWithdrawal);

// Exporting the router for use in other modules
module.exports = router;
