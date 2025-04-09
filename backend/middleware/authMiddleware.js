const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authorized, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

module.exports = { protect };
