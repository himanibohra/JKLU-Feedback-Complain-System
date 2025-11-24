module.exports = (req, res, next) => {
  try {
    const user = req.user; // set by auth middleware
    if (!user) return res.status(401).json({ msg: "Unauthorized" });
    if (user.role !== "admin" && user.role !== "council") {
      return res.status(403).json({ msg: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
