const { v4: uuidv4 } = require("uuid");
const Complaint = require("../Models/complaint");
const Attachment = require("../Models/attachment");
const db = require("../Configs/db");

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    console.log('=== CREATE COMPLAINT REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);

    const {
      title,
      description,
      category_id,
      location,
      priority,
      is_anonymous
    } = req.body;

    const user_id = req.user.user_id;

    // Validate required fields
    if (!title || !description || !category_id || !location || !priority) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: { title, description, category_id, location, priority }
      });
    }

    // Get department from category
    db.query(
      "SELECT department_id FROM categories WHERE category_id = ?",
      [category_id],
      async (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
          console.error('Invalid category_id:', category_id);
          return res.status(400).json({ msg: "Invalid category" });
        }

        const department_id = rows[0].department_id;
        const reference_code = uuidv4();

        const data = {
          user_id,
          title,
          description,
          category_id,
          department_id,
          location,
          priority,
          is_anonymous: is_anonymous === 'true' || is_anonymous === true, // Handle string/boolean
          reference_code
        };

        console.log('Creating complaint with data:', data);

        const result = await Complaint.create(data);
        const complaint_id = result.insertId;

        console.log('Complaint created with ID:', complaint_id);

        // Handle Attachments
        const attachments = [];
        if (req.files && req.files.length > 0) {
          console.log('Processing attachments:', req.files.length);
          for (const file of req.files) {
            const file_url = `/uploads/${file.filename}`;
            await Attachment.add(complaint_id, file_url);
            attachments.push(file_url);
          }
        }

        console.log('=== COMPLAINT CREATED SUCCESSFULLY ===');
        res.json({
          msg: "Complaint created successfully",
          complaint_id,
          reference_code,
          attachments
        });
      }
    );
  } catch (err) {
    console.error('=== ERROR CREATING COMPLAINT ===');
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get complaints of logged-in user
exports.getMyComplaints = async (req, res) => {
  try {
    console.log('=== GET MY COMPLAINTS REQUEST ===');
    console.log('User:', req.user);
    console.log('Query params:', req.query);

    if (!req.user || !req.user.user_id) {
      console.error('No user found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user_id = req.user.user_id;
    console.log('Fetching complaints for user_id:', user_id);

    const list = await Complaint.getByUser(user_id);
    console.log('Found complaints:', list.length);

    // Transform data to match frontend TypeScript interface
    const transformedData = list.map(complaint => ({
      id: complaint.complaint_id.toString(),
      title: complaint.title,
      description: complaint.description,
      category: complaint.category_name,
      categoryId: complaint.category_id?.toString() || '',
      location: complaint.location,
      priority: complaint.priority,
      status: complaint.status,
      isAnonymous: Boolean(complaint.is_anonymous),
      userId: complaint.user_id?.toString() || '',
      userName: complaint.user_name || '',
      departmentId: complaint.department_id?.toString() || '',
      departmentName: complaint.department_name || '',
      attachments: [],
      createdAt: complaint.created_at,
      updatedAt: complaint.updated_at
    }));

    // Return in paginated format expected by frontend
    const response = {
      data: transformedData,
      pagination: {
        page: 1,
        limit: transformedData.length,
        total: transformedData.length,
        totalPages: 1
      }
    };

    console.log('=== RETURNING COMPLAINTS ===');
    console.log('Total:', transformedData.length);
    res.json(response);
  } catch (err) {
    console.error('=== ERROR GETTING COMPLAINTS ===');
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get single complaint full detail
exports.getComplaintDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== GET COMPLAINT DETAILS ===');
    console.log('Complaint ID:', id);

    const complaint = await Complaint.getById(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Get user info
    const userQuery = `SELECT name, email FROM users WHERE user_id = ?`;
    const userResult = await new Promise((resolve, reject) => {
      db.query(userQuery, [complaint.user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0] || {});
      });
    });

    // Get category info
    const categoryQuery = `SELECT category_id, name FROM categories WHERE category_id = ?`;
    const categoryResult = await new Promise((resolve, reject) => {
      db.query(categoryQuery, [complaint.category_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0] || {});
      });
    });

    // Get attachments
    const attachmentsQuery = `SELECT attachment_id, file_url, uploaded_at FROM attachments WHERE complaint_id = ?`;
    const attachments = await new Promise((resolve, reject) => {
      db.query(attachmentsQuery, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Get comments
    const commentsQuery = `
      SELECT com.comment_id, com.comment_text, com.created_at, u.name as user_name, u.user_id, u.role as user_role
      FROM comments com
      LEFT JOIN users u ON com.user_id = u.user_id
      WHERE com.complaint_id = ?
      ORDER BY com.created_at ASC
    `;
    const comments = await new Promise((resolve, reject) => {
      db.query(commentsQuery, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Transform to frontend format
    const response = {
      id: complaint.complaint_id.toString(),
      title: complaint.title,
      description: complaint.description,
      category: categoryResult.name || '',
      categoryId: complaint.category_id?.toString() || '',
      location: complaint.location,
      priority: complaint.priority,
      status: complaint.status,
      isAnonymous: Boolean(complaint.is_anonymous),
      userId: complaint.user_id?.toString() || '',
      userName: userResult.name || 'Unknown User',
      departmentId: complaint.department_id?.toString() || '',
      departmentName: complaint.department_name || '',
      referenceCode: complaint.reference_code || '',
      createdAt: complaint.created_at,
      updatedAt: complaint.updated_at,
      attachments: attachments.map(att => ({
        id: att.attachment_id.toString(),
        url: att.file_url,
        filename: att.file_url.split('/').pop(),
        uploadedAt: att.uploaded_at
      })),
      comments: comments.map(comment => ({
        id: comment.comment_id.toString(),
        complaintId: id.toString(),
        content: comment.comment_text,
        userId: comment.user_id?.toString() || '',
        userName: comment.user_name || 'Unknown',
        userRole: comment.user_role || 'student',
        createdAt: comment.created_at,
        attachments: [] // Comments don't have direct attachments in current schema
      })),
      statusHistory: [
        {
          id: uuidv4(),
          status: complaint.status,
          timestamp: complaint.updated_at || complaint.created_at,
          note: 'Current status',
          changedBy: complaint.user_id?.toString() || '',
          changedByName: userResult.name || 'Unknown'
        }
      ]
    };

    console.log('Returning complaint details:', response);
    res.json(response);
  } catch (err) {
    console.error('Error getting complaint details:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update complaint status (Admin only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaint_id, status } = req.body;

    const allowed = ["pending", "in_progress", "resolved", "closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    await Complaint.updateStatus(complaint_id, status);

    res.json({ msg: "Complaint status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log("Fetching categories from DB...");
    db.query("SELECT * FROM categories", (err, rows) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Categories found:", rows);

      // Transform data to match frontend TypeScript interface
      const transformedCategories = rows.map(cat => ({
        id: cat.category_id.toString(),
        name: cat.name,
        description: cat.description || '',
        departmentId: cat.department_id?.toString() || '',
        departmentName: cat.department_name || '',
        createdAt: cat.created_at
      }));

      console.log("Transformed categories:", transformedCategories);
      res.json(transformedCategories);
    });
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add comment to complaint
exports.addCommentToComplaint = async (req, res) => {
  try {
    const complaint_id = req.params.id;
    const { content } = req.body;
    const user_id = req.user.user_id;

    console.log('=== ADD COMMENT ===');
    console.log('Complaint ID:', complaint_id);
    console.log('Content:', content);
    console.log('User ID:', user_id);

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Insert comment into database
    const Comment = require("../Models/comment");
    await Comment.add(complaint_id, user_id, content);

    // Handle Attachments for Comment (if any)
    // Note: Currently attachments are linked to complaint_id, not comment_id directly in the schema
    // So we will add them as complaint attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing comment attachments:', req.files.length);
      for (const file of req.files) {
        const file_url = `/uploads/${file.filename}`;
        await Attachment.add(complaint_id, file_url);
        attachments.push(file_url);
      }
    }

    res.json({
      msg: "Comment added successfully",
      comment: {
        content,
        userId: user_id,
        createdAt: new Date(),
        attachments
      }
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: err.message });
  }
};

// Upload attachments to complaint
exports.uploadAttachments = async (req, res) => {
  try {
    const complaint_id = req.params.id;
    console.log('=== UPLOAD ATTACHMENTS ===');
    console.log('Complaint ID:', complaint_id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const attachments = [];
    for (const file of req.files) {
      const file_url = `/uploads/${file.filename}`;
      await Attachment.add(complaint_id, file_url);
      attachments.push({
        url: file_url,
        filename: file.filename
      });
    }

    res.json({
      msg: "Attachments uploaded successfully",
      attachments
    });
  } catch (err) {
    console.error('Error uploading attachments:', err);
    res.status(500).json({ error: err.message });
  }
};
