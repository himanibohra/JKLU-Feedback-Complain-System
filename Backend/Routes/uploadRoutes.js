const express = require("express");
const router = express.Router();
const uploadController = require("../Controllers/uploadController");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// POST /api/upload - Upload files
router.post("/", verifyToken, upload.array("files", 5), uploadController.uploadFiles);

module.exports = router;
