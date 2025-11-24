const db = require("../Configs/db");

const Attachment = {
  add: (complaint_id, file_url) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO attachments (complaint_id, file_url)
        VALUES (?, ?)
      `;
      db.query(query, [complaint_id, file_url], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },

  getByComplaint: (complaint_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT attachment_id, file_url, uploaded_at 
        FROM attachments
        WHERE complaint_id = ?
      `;
      db.query(query, [complaint_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Attachment;
