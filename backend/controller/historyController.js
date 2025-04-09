const { Sequelize } = require("sequelize");
const ChatHistory = require("../model/historyModel");

// Save a chat message
const saveMessage = async (req, res, next) => {
  try {
    const { user_id, session_id, message, sender } = req.body;

    const chat = await ChatHistory.create({
      user_id,
      session_id,
      message,
      sender,
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// Get recent chat sessions for the sidebar
const getChatSessions = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const history = await ChatHistory.findAll({
      where: { user_id },
      attributes: [
        "session_id",
        [Sequelize.fn("MAX", Sequelize.col("createdAt")), "latestCreatedAt"],
      ],
      group: ["session_id"],
      order: [[Sequelize.fn("MAX", Sequelize.col("createdAt")), "DESC"]],
    });

    res.json({ success: true, sessions: history });
  } catch (error) {
    next(error);
  }
};

// Get messages of a specific session
const getMessagesBySession = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const messages = await ChatHistory.findAll({
      where: { session_id },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveMessage,
  getChatSessions,
  getMessagesBySession,
};
