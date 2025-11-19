const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header("Authorization");

    console.log("🔐 Auth Middleware - Raw Authorization header:", token);

    if (!token) {
      console.log("❌ No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    console.log("🔐 Token after processing:", token.substring(0, 20) + "...");

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );
    console.log("🔐 Decoded token:", decoded);

    // Check if decoded has id
    if (!decoded || !decoded.id) {
      console.log("❌ Token missing id");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");
    console.log("🔐 Found user:", user ? user.email : "NOT FOUND");

    if (!user) {
      console.log("❌ User not found for id:", decoded.id);
      return res.status(401).json({ message: "User not found for this token" });
    }

    // Attach user to request
    req.user = user;
    console.log("✅ User attached to request:", req.user.email);

    next();
  } catch (error) {
    console.error("🔐 Auth middleware error:", error.message);

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
    console.log("🔐 Admin auth check");
    await auth(req, res, () => {});

    if (req.user.role !== "admin") {
      console.log("❌ User is not admin:", req.user.role);
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    console.log("✅ User is admin");
    next();
  } catch (error) {
    console.error("🔐 Admin auth error:", error);
    res.status(401).json({ message: "Admin authentication failed" });
  }
};

module.exports = { auth, adminAuth };
