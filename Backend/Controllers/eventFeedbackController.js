const EventFeedback = require("../Models/eventFeedback");

// Admin creates an event
exports.createEvent = async (req, res) => {
  try {
    const { name, category } = req.body;
    const result = await EventFeedback.createEvent(name, category);
    res.json({ msg: "Event created", event_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Students submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { event_id, rating, feedback_text, is_anonymous } = req.body;
    const user_id = req.user.user_id;

    await EventFeedback.submitFeedback({
      event_id,
      user_id,
      rating,
      feedback_text,
      is_anonymous
    });

    res.json({ msg: "Event feedback submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventList = async (req, res) => {
  try {
    const list = await EventFeedback.getEventList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: view all feedback for an event
exports.getEventFeedback = async (req, res) => {
  try {
    const event_id = req.params.id;
    const data = await EventFeedback.getEventFeedback(event_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin analytics
exports.getEventStats = async (req, res) => {
  try {
    const event_id = req.params.id;
    const stats = await EventFeedback.getEventStats(event_id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrend = async (req, res) => {
  try {
    const event_id = req.params.id;
    const data = await EventFeedback.getTrend(event_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
