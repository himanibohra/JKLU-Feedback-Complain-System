const Comment = require("../Models/comment");

exports.addComment = async (req, res) => {
  try {
    const { complaint_id, comment_text } = req.body;
    const user_id = req.user.user_id;

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    await Comment.add(complaint_id, user_id, comment_text);

    res.json({ msg: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const complaint_id = req.params.id;

    const comments = await Comment.getByComplaint(complaint_id);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.user_id;

    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user_id !== user_id) {
      return res.status(403).json({ msg: "Not authorized to update this comment" });
    }

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    await Comment.update(id, comment_text);
    res.json({ msg: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user_id !== user_id) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    await Comment.delete(id);
    res.json({ msg: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
