const db = require("../Configs/db");

const Feedback = {
  add: (data) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO feedback (user_id, category_id, feedback_text, is_anonymous)
        VALUES (?, ?, ?, ?)
      `;
      db.query(
        query,
        [data.user_id, data.category_id, data.feedback_text, data.is_anonymous],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  },

  // ADMIN — get all feedback with filters
  getAll: (filters = {}) => {
    let query = `
      SELECT 
        f.feedback_id,
        f.feedback_text,
        f.is_anonymous,
        f.created_at,
        c.name AS category_name,
        u.name AS user_name,
        u.role AS user_role
      FROM feedback f
      JOIN categories c ON f.category_id = c.category_id
      LEFT JOIN users u ON f.user_id = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.category_id) {
      query += " AND f.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.is_anonymous !== undefined) {
      query += " AND f.is_anonymous = ?";
      params.push(filters.is_anonymous ? 1 : 0);
    }

    if (filters.start_date && filters.end_date) {
      query += " AND f.created_at BETWEEN ? AND ?";
      params.push(filters.start_date, filters.end_date);
    }

    query += " ORDER BY f.created_at DESC";

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Analytics
  getCategoryWise: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.name AS category_name, COUNT(*) AS count
        FROM feedback f
        JOIN categories c ON f.category_id = c.category_id
        GROUP BY f.category_id
      `;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getTimeTrend: (interval = "daily") => {
    return new Promise((resolve, reject) => {
      let query;

      if (interval === "monthly") {
        query = `
          SELECT DATE_FORMAT(created_at, '%Y-%m') AS period, COUNT(*) AS count
          FROM feedback
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
          ORDER BY period;
        `;
      } else if (interval === "weekly") {
        query = `
          SELECT YEARWEEK(created_at, 1) AS period, COUNT(*) AS count
          FROM feedback
          GROUP BY YEARWEEK(created_at, 1)
          ORDER BY period;
        `;
      } else {
        query = `
          SELECT DATE(created_at) AS period, COUNT(*) AS count
          FROM feedback
          GROUP BY DATE(created_at)
          ORDER BY period;
        `;
      }

      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Feedback;
