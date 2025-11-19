const express = require("express");
const {
  getDashboardStats,
  getAnalytics,
} = require("../controllers/adminController");
const { adminAuth } = require("../middleware/auth");
const activityLogger = require("../middleware/logger");

const router = express.Router();

router.get(
  "/dashboard",
  adminAuth,
  activityLogger("VIEW", "DASHBOARD"),
  getDashboardStats
);
router.get(
  "/analytics",
  adminAuth,
  activityLogger("VIEW", "ANALYTICS"),
  getAnalytics
);

module.exports = router;
