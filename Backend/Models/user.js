const db = require("../Configs/db");

const User = {
  create: (name, email, password_hash, role, department_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (name, email, password_hash, role, department_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(query, [name, email, password_hash, role, department_id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },

  findById: (user_id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },

  updateDepartment: (user_id, department_id) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET department_id = ? WHERE user_id = ?";
      db.query(query, [department_id, user_id], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
};

module.exports = User;

