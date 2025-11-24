const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
// Helmet can block image loading from different origins or protocols, 
// so we might need to configure it or disable it for uploads if issues persist.
// For now, we'll keep it but be aware.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Serve uploaded files statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Request Logger
app.use((req, res, next) => {
  console.log(`Global Logger: ${req.method} ${req.url}`);
  next();
});

// Rate limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
  })
);

// Database connection
require("./Configs/db");

// Test route
app.get("/", (req, res) => {
  res.send("JKLU Backend Running Successfully 🚀");
});

// Import Routes
const authRoutes = require("./Routes/authRoutes");
app.use("/api/auth", authRoutes);

// Complaint Routes
const complaintRoutes = require("./Routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Upload Routes
const uploadRoutes = require("./Routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

// Comment Routes
const commentRoutes = require("./Routes/commentRoutes");
app.use("/api/comments", commentRoutes);

// Attachment Routes
const attachmentRoutes = require("./Routes/attachmentRoutes");
app.use("/api/attachments", attachmentRoutes);

// Department Routes
const departmentRoutes = require("./Routes/departmentRoutes");
app.use("/api/department", departmentRoutes);

// Admin Routes
const adminRoutes = require("./Routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Feedback Routes
const feedbackRoutes = require("./Routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

// Event Feedback Routes
const eventFeedbackRoutes = require("./Routes/eventFeedbackRoutes");
app.use("/api/event-feedback", eventFeedbackRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
