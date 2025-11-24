const db = require("../Configs/db");

const Department = {
  getDepartmentComplaints: (department_id, filters = {}) => {
    let query = `
      SELECT 
        c.complaint_id,
        c.title,
        c.description,
        c.location,
        c.priority,
        c.status,
        c.created_at,
        cat.name AS category_name
      FROM complaints c
      JOIN categories cat ON c.category_id = cat.category_id
      WHERE c.department_id = ?
    `;

    let params = [department_id];

    // Add filters dynamically
    if (filters.category_id) {
      query += " AND c.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.priority) {
      query += " AND c.priority = ?";
      params.push(filters.priority);
    }

    if (filters.status) {
      query += " AND c.status = ?";
      params.push(filters.status);
    }

    if (filters.start_date && filters.end_date) {
      query += " AND c.created_at BETWEEN ? AND ?";
      params.push(filters.start_date, filters.end_date);
    }

    query += " ORDER BY c.created_at DESC";

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Analytics
  getStatusCounts: (department_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT status, COUNT(*) AS count
        FROM complaints
        WHERE department_id = ?
        GROUP BY status
      `;
      db.query(query, [department_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getCategoryDistribution: (department_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cat.name AS category_name, COUNT(*) AS count
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.category_id
        WHERE c.department_id = ?
        GROUP BY c.category_id
      `;
      db.query(query, [department_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getWeeklyTrend: (department_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM complaints
        WHERE department_id = ?
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      `;
      db.query(query, [department_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Get all departments
  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT department_id, name FROM departments ORDER BY name`;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Department;
