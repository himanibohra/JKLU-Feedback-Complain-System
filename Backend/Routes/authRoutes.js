const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const { verifyToken } = require("../middlewares/auth");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me
router.get("/me", verifyToken, authController.getMe);

// PUT /api/auth/update-department
router.put("/update-department", verifyToken, authController.updateDepartment);

module.exports = router;

