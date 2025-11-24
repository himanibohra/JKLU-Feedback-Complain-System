const Feedback = require("../Models/feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { category_id, feedback_text, is_anonymous } = req.body;
    const user_id = req.user.user_id;

    if (!feedback_text || feedback_text.trim() === "") {
      return res.status(400).json({ msg: "Feedback cannot be empty" });
    }

    await Feedback.add({
      user_id,
      category_id,
      feedback_text,
      is_anonymous
    });

    res.json({ msg: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedbackList = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id,
      is_anonymous: req.query.is_anonymous !== undefined
        ? req.query.is_anonymous === "true"
        : undefined,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const list = await Feedback.getAll(filters);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryAnalytics = async (req, res) => {
  try {
    const data = await Feedback.getCategoryWise();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTimeTrend = async (req, res) => {
  try {
    const interval = req.query.interval || "daily";
    const data = await Feedback.getTimeTrend(interval);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
