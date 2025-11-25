const db = require("../Configs/db");

const Complaint = {

  // Create complaint
  create: (data) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO complaints 
        (user_id, title, description, category_id, department_id, location, priority, is_anonymous, reference_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [
          data.user_id,
          data.title,
          data.description,
          data.category_id,
          data.department_id,
          data.location,
          data.priority,
          data.is_anonymous,
          data.reference_code
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // Get complaints by user
  getByUser: (user_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.complaint_id,
          c.title,
          c.description,
          c.location,
          c.priority,
          c.status,
          c.is_anonymous,
          cat.name AS category_name,
          c.created_at,
          c.updated_at
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.category_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `;

      db.query(query, [user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Get single complaint details (only required fields)
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.complaint_id,
          c.user_id,
          c.title,
          c.description,
          c.category_id,
          c.department_id,
          d.name AS department_name,
          c.location,
          c.priority,
          c.status,
          c.is_anonymous,
          c.reference_code,
          c.created_at,
          c.updated_at
        FROM complaints c
        JOIN departments d ON c.department_id = d.department_id
        WHERE c.complaint_id = ?
      `;

      db.query(query, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  },

  // Get complaints by department (for department heads)
  getByDepartment: (department_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.complaint_id,
          c.user_id,
          c.title,
          c.description,
          c.category_id,
          c.department_id,
          c.location,
          c.priority,
          c.status,
          c.is_anonymous,
          c.reference_code,
          cat.name AS category_name,
          d.name AS department_name,
          u.name AS user_name,
          c.created_at,
          c.updated_at
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.category_id
        JOIN departments d ON c.department_id = d.department_id
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.department_id = ?
        ORDER BY c.created_at DESC
      `;

      db.query(query, [department_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Update complaint status
  updateStatus: (complaint_id, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE complaints 
        SET status = ?, updated_at = NOW()
        WHERE complaint_id = ?
      `;
      db.query(query, [status, complaint_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Delete complaint
  delete: (complaint_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM complaints 
        WHERE complaint_id = ?
      `;
      db.query(query, [complaint_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

module.exports = Complaint;
