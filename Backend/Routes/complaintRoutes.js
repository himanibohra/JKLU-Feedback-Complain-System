const express = require("express");
const router = express.Router();
const complaintController = require("../Controllers/complaintController");
const { verifyToken } = require("../middlewares/auth");

const upload = require("../middlewares/upload");

// GET /api/complaints/categories - Get all categories
router.get("/categories", verifyToken, complaintController.getAllCategories);

// POST /api/complaints - Create complaint
router.post("/", verifyToken, upload.array("attachments", 5), complaintController.createComplaint);

// GET /api/complaints - Get user's complaints
router.get("/", verifyToken, complaintController.getMyComplaints);

// GET /api/complaints/:id - Get complaint details
router.get("/:id", verifyToken, complaintController.getComplaintDetails);

// PUT /api/complaints/:id/status - Update complaint status
router.put("/:id/status", verifyToken, complaintController.updateComplaintStatus);

// POST /api/complaints/:id/comments - Add comment to complaint
router.post("/:id/comments", verifyToken, upload.array("attachments", 5), complaintController.addCommentToComplaint);

// POST /api/complaints/:id/attachments - Upload attachments to complaint
router.post("/:id/attachments", verifyToken, upload.array("attachments", 5), complaintController.uploadAttachments);

module.exports = router;
