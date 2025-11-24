const express = require("express");
const router = express.Router();
const attachmentController = require("../Controllers/attachmentController");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// POST /api/attachments - Upload attachments to complaint
router.post("/", verifyToken, upload.array("files", 5), attachmentController.uploadAttachments);

module.exports = router;

