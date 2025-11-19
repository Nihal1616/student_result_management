const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header("Authorization"); // raw Authorization header received (hidden for privacy)

    // raw Authorization header received (hidden for privacy)

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // token after processing

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );
    // token decoded

    // Check if decoded has id
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");
    // Found user

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    // Attach user to request
    req.user = user;
    // User attached to request

    next();
  } catch (error) {
    // auth middleware error

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res
      .status(500)
      .json({
        message: "Server error during authentication",
        error: error.message,
      });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // admin auth check
    await auth(req, res, () => {});

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    // User is admin
    next();
  } catch (error) {
    // Admin auth error
    res.status(401).json({ message: "Admin authentication failed" });
  }
};

module.exports = { auth, adminAuth };
