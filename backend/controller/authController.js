const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES;

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email is already taken",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);;
    
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, secretKey, { expiresIn });

    res.status(201).json({
      status: "success",
      message: "Successfully created new user",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { signUp, signIn };
