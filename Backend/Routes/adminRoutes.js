const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// GET /api/admin/summary - Get summary analytics
router.get("/summary", adminController.getSummary);

// GET /api/admin/complaints - Get filtered complaints
router.get("/complaints", adminController.getFilteredComplaints);

module.exports = router;

