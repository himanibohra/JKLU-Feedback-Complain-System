const db = require("../Configs/db");

const Comment = {
  add: (complaint_id, user_id, comment_text) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO comments (complaint_id, user_id, comment_text)
        VALUES (?, ?, ?)
      `;
      db.query(query, [complaint_id, user_id, comment_text], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  getByComplaint: (complaint_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.comment_id,
          c.comment_text,
          c.created_at,
          c.user_id,
          u.name AS user_name,
          u.role AS user_role
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.complaint_id = ?
        ORDER BY c.created_at ASC
      `;
      db.query(query, [complaint_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  update: (comment_id, comment_text) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE comments 
        SET comment_text = ? 
        WHERE comment_id = ?
      `;
      db.query(query, [comment_text, comment_id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  delete: (comment_id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM comments WHERE comment_id = ?`;
      db.query(query, [comment_id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  getById: (comment_id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM comments WHERE comment_id = ?`;
      db.query(query, [comment_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  }
};

module.exports = Comment;
