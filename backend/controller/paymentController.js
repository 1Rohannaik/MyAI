const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../model/userModel");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate a unique API key
const generateApiKey = (id) => {
  return crypto
    .createHash("sha256")
    .update(id.toString() + Date.now().toString())
    .digest("hex");
};

// Create order endpoint
const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// Verify payment endpoint
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, plan, amount } = req.body;

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    const expectedAmount = Math.round(amount * 100);
    if (payment.amount !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // Determine API credits to add
    let inc = 0;
    if (plan === "pro") inc = 50;
    else if (plan === "premium") inc = 100; // Add other plans if needed

    // Get user from request (set by verifyJWT middleware)
    const id = req.user.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.api_key) {
      const token = generateApiKey(id);
      user.api_key = token;
    }

    user.apiKeyActive = true;
    user.totalRemaining = user.totalRemaining + inc;
    user.isSubscribed = true; 

    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = { createOrder, verifyPayment };
