const db = require("../Configs/db");

const Admin = {
  // Summary cards
  getSummaryCounts: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          (SELECT COUNT(*) FROM complaints) AS total_complaints,
          (SELECT COUNT(*) FROM complaints WHERE status = 'pending') AS pending_complaints,
          (SELECT COUNT(*) FROM complaints WHERE status = 'resolved') AS resolved_complaints,
          (SELECT COUNT(*) FROM complaints WHERE priority IN ('high','critical')) AS high_priority_complaints,
          (SELECT COUNT(*) FROM complaints WHERE is_anonymous = 1) AS anonymous_complaints
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },

  // Department-wise complaints (bar chart)
  getDepartmentWise: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.name AS department_name, COUNT(c.complaint_id) AS count
        FROM departments d
        LEFT JOIN complaints c ON c.department_id = d.department_id
        GROUP BY d.department_id
        ORDER BY count DESC
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Priority distribution (pie)
  getPriorityDistribution: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT priority, COUNT(*) AS count
        FROM complaints
        GROUP BY priority
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Category distribution
  getCategoryDistribution: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cat.name AS category_name, COUNT(c.complaint_id) AS count
        FROM categories cat
        LEFT JOIN complaints c ON c.category_id = cat.category_id
        GROUP BY cat.category_id
        ORDER BY count DESC
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Status distribution (stacked bar / counts per department)
  getStatusDistribution: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.name AS department_name,
          SUM(CASE WHEN c.status = 'pending' THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN c.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
          SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
          SUM(CASE WHEN c.status = 'closed' THEN 1 ELSE 0 END) AS closed
        FROM departments d
        LEFT JOIN complaints c ON c.department_id = d.department_id
        GROUP BY d.department_id
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Time trend (complaints per day/month). Accepts interval param: 'daily'|'monthly'|'weekly'
  getTimeTrend: (interval = "daily") => {
    return new Promise((resolve, reject) => {
      let query;
      if (interval === "monthly") {
        query = `
          SELECT DATE_FORMAT(created_at, '%Y-%m') AS period, COUNT(*) AS count
          FROM complaints
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
          ORDER BY period;
        `;
      } else if (interval === "weekly") {
        // MySQL: YEARWEEK for weekly
        query = `
          SELECT YEARWEEK(created_at, 1) AS period, COUNT(*) AS count
          FROM complaints
          GROUP BY YEARWEEK(created_at, 1)
          ORDER BY period;
        `;
      } else {
        // default daily
        query = `
          SELECT DATE(created_at) AS period, COUNT(*) AS count
          FROM complaints
          GROUP BY DATE(created_at)
          ORDER BY period;
        `;
      }
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Clickable: Return list of complaints by provided filter (department/category/status/priority/date range/anonymous)
  getFilteredComplaints: (filters = {}) => {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT c.complaint_id, c.title, c.category_id, cat.name AS category_name,
               c.department_id, d.name AS department_name,
               c.priority, c.status, c.is_anonymous, c.created_at
        FROM complaints c
        LEFT JOIN categories cat ON c.category_id = cat.category_id
        LEFT JOIN departments d ON c.department_id = d.department_id
        WHERE 1=1
      `;
      const params = [];

      if (filters.department_id) {
        query += " AND c.department_id = ?";
        params.push(filters.department_id);
      }
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
      if (filters.is_anonymous !== undefined) {
        query += " AND c.is_anonymous = ?";
        params.push(filters.is_anonymous ? 1 : 0);
      }
      if (filters.start_date && filters.end_date) {
        query += " AND c.created_at BETWEEN ? AND ?";
        params.push(filters.start_date, filters.end_date);
      }

      query += " ORDER BY c.created_at DESC";

      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Admin;