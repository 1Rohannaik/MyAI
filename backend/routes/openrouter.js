const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../model/userModel");
const { protect } = require("../middleware/authMiddleware");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/generate", protect, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!user.isSubscribed && user.freePromptsUsed >= 3) {
      return res.status(403).json({
        error: "Free usage limit exceeded. Please subscribe to continue.",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. Always reply in clean HTML without any markdown or asterisks. Use <strong>, <em>, <h2>, <ul>, <li>, <code>, and <br> tags where needed.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "My Gemini Clone",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    if (!user.isSubscribed) {
      user.freePromptsUsed += 1;
      await user.save();
    }

    res.json({ reply });
  } catch (error) {
    console.error(
      "OpenRouter API Error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

module.exports = router;
