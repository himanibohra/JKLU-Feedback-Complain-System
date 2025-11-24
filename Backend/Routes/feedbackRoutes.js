const express = require("express");
const router = express.Router();
const feedbackController = require("../Controllers/feedbackController");
const { verifyToken } = require("../middlewares/auth");

// POST /api/feedback - Submit general feedback
router.post("/", verifyToken, feedbackController.submitFeedback);

// GET /api/feedback - Get all feedback
router.get("/", verifyToken, feedbackController.getFeedbackList);

module.exports = router;

