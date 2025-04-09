const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controller/paymentController");
const verifyJWT = require("../middleware/verifyJWT"); // Assuming this exists

// Routes
router.post("/orders", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);

module.exports = router;
