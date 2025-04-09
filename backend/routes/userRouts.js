const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate")

const { signUp, signIn } = require("../controller/authController");

router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

router.post("/signup", signUp);
router.post("/signin", signIn);


module.exports = router;
