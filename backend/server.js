const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const historyRoutes = require("./routes/historyRouts");
const userRoutes = require("./routes/userRouts");
const errorHandler = require("./errorHandler");
const paymentRoutes = require("./routes/paymentRouts");
const openRouterRoutes = require("./routes/openrouter");


const app = express();
const port = process.env.PORT || 3000;



// ✅ Enable CORS before other middlewares and routes
app.use(
  cors({
    origin: "https://myai-d0k0.onrender.com", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false, // Set to true only if you're using cookies/sessions
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/history", historyRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/openrouter", openRouterRoutes);




// Error handling
app.use(errorHandler);

// Start server after syncing DB
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(port, () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => console.log("Database sync error:", err));
