const db = require("../Configs/db");

const EventFeedback = {
  createEvent: (name, category) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO events (event_name, category) VALUES (?, ?)`;
      db.query(query, [name, category], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  submitFeedback: (data) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO event_feedback (event_id, user_id, rating, feedback_text, is_anonymous)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        query,
        [data.event_id, data.user_id, data.rating, data.feedback_text, data.is_anonymous],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  },

  getEventFeedback: (event_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT ef.feedback_id, ef.rating, ef.feedback_text, ef.created_at,
               u.name AS user_name, u.role AS user_role, ef.is_anonymous
        FROM event_feedback ef
        JOIN users u ON ef.user_id = u.user_id
        WHERE ef.event_id = ?
        ORDER BY ef.created_at DESC
      `;
      db.query(query, [event_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getEventList: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM events ORDER BY created_at DESC`;
      db.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Analytics
  getEventStats: (event_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          COUNT(*) AS feedback_count,
          AVG(rating) AS average_rating
        FROM event_feedback
        WHERE event_id = ?
      `;
      db.query(query, [event_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },

  getTrend: (event_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT DATE(created_at) AS date, COUNT(*) AS count
        FROM event_feedback
        WHERE event_id = ?
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      db.query(query, [event_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = EventFeedback;
