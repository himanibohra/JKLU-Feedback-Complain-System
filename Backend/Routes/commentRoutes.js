const express = require("express");
const router = express.Router();
const commentController = require("../Controllers/commentController");
const { verifyToken } = require("../middlewares/auth");

// POST /api/comments - Add comment to complaint
router.post("/", verifyToken, commentController.addComment);

// GET /api/comments/:complaint_id - Get comments for a complaint
router.get("/:complaint_id", verifyToken, commentController.getComments);

// PUT /api/comments/:id - Update a comment
router.put("/:id", verifyToken, commentController.updateComment);

// DELETE /api/comments/:id - Delete a comment
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;
