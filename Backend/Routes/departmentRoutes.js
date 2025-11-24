const express = require("express");
const router = express.Router();
const departmentController = require("../Controllers/departmentController");
const { verifyToken } = require("../middlewares/auth");

// GET /api/department - Get all departments (public for signup)
router.get("/", departmentController.getAllDepartments);

// GET /api/department/:id/complaints - Get complaints by department
router.get("/:id/complaints", verifyToken, departmentController.getDepartmentComplaints);

module.exports = router;


