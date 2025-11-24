const AdminModel = require("../Models/admin");

// Summary cards
exports.getSummary = async (req, res) => {
  try {
    const data = await AdminModel.getSummaryCounts();
    // Transform to match frontend expectations
    res.json({
      total: data.total_complaints || 0,
      pending: data.pending_complaints || 0,
      resolved: data.resolved_complaints || 0,
      high_priority: data.high_priority_complaints || 0,
      anonymous: data.anonymous_complaints || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Department-wise (bar chart)
exports.getDepartmentWise = async (req, res) => {
  try {
    const data = await AdminModel.getDepartmentWise();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Priority distribution
exports.getPriorityDistribution = async (req, res) => {
  try {
    const data = await AdminModel.getPriorityDistribution();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Category distribution
exports.getCategoryDistribution = async (req, res) => {
  try {
    const data = await AdminModel.getCategoryDistribution();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Status distribution (stacked)
exports.getStatusDistribution = async (req, res) => {
  try {
    const data = await AdminModel.getStatusDistribution();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Time trend (query param: ?interval=daily|weekly|monthly)
exports.getTimeTrend = async (req, res) => {
  try {
    const interval = req.query.interval || "daily";
    const data = await AdminModel.getTimeTrend(interval);
    // Transform period to date for frontend
    const transformed = data.map(item => ({
      date: item.period,
      count: item.count
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clickable filter list
exports.getFilteredComplaints = async (req, res) => {
  try {
    const filters = {
      department_id: req.query.department_id,
      category_id: req.query.category_id,
      priority: req.query.priority,
      status: req.query.status,
      is_anonymous: req.query.is_anonymous !== undefined ? (req.query.is_anonymous === "true") : undefined,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };
    const data = await AdminModel.getFilteredComplaints(filters);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};