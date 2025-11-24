const Department = require("../Models/department");

// GET complaints assigned to a department
exports.getDepartmentComplaints = async (req, res) => {
  try {
    const department_id = req.user.department_id; // department head token

    const filters = {
      category_id: req.query.category_id,
      priority: req.query.priority,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    };

    const complaints = await Department.getDepartmentComplaints(department_id, filters);

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Analytics: Status counts
exports.getStatusCounts = async (req, res) => {
  try {
    const department_id = req.user.department_id;

    const data = await Department.getStatusCounts(department_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Analytics: Category distribution
exports.getCategoryDistribution = async (req, res) => {
  try {
    const department_id = req.user.department_id;

    const data = await Department.getCategoryDistribution(department_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Analytics: Weekly trend
exports.getWeeklyTrend = async (req, res) => {
  try {
    const department_id = req.user.department_id;

    const data = await Department.getWeeklyTrend(department_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all departments (public - for signup)
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.getAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

