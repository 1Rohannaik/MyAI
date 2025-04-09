const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ChatHistory = sequelize.define(
  "ChatHistory",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ChatHistory;
