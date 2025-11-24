const express = require("express");
const router = express.Router();
const eventFeedbackController = require("../Controllers/eventFeedbackController");
const { verifyToken } = require("../middlewares/auth");

// POST /api/event-feedback - Submit event feedback
router.post("/", verifyToken, eventFeedbackController.submitFeedback);

// GET /api/event-feedback - Get event list
router.get("/", verifyToken, eventFeedbackController.getEventList);

// GET /api/event-feedback/:event_id - Get feedback for specific event
router.get("/:event_id", verifyToken, eventFeedbackController.getEventFeedback);

module.exports = router;

