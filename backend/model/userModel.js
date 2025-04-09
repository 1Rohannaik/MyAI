const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Import Sequelize instance
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // ✅ New fields below
  isSubscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  freePromptsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  api_key: {
    type: DataTypes.STRING,
  },
  apiKeyActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  totalRemaining: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
