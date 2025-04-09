const express = require("express");
const router = express.Router();
const {
  saveMessage,
  getChatSessions,
  getMessagesBySession,
} = require("../controller/historyController");

const { protect } = require("../middleware/authMiddleware");

// Save chat message — match frontend POST /api/v1/history
router.post("/", protect, saveMessage);

// Get chat history sessions for a user
router.get("/:user_id", protect, getChatSessions);

// Get messages from a specific session
router.get("/session/:session_id", protect, getMessagesBySession);

module.exports = router;
