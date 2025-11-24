const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log(`Auth Middleware: ${req.method} ${req.originalUrl}`);

  if (!token) {
    console.log("Auth Middleware: No token provided");
    return res.status(401).json({ msg: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Auth Middleware: Invalid token");
      return res.status(403).json({ msg: "Invalid or expired token" });
    }
    req.user = user;
    console.log("Auth Middleware: Token verified for user", user.user_id);
    next();
  });
};

module.exports = {
  authenticateToken,
  verifyToken: authenticateToken, // Alias for route compatibility
  isAdmin: require("./adminOnly")
};


