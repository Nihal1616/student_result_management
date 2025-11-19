const express = require("express");
const {
  getResults,
  getStudentResults,
  createResult,
  updateResult,
  deleteResult,
  getRankings,
} = require("../controllers/resultController");
const { auth, adminAuth } = require("../middleware/auth");
const { resultValidation } = require("../middleware/validation");
const activityLogger = require("../middleware/logger");

const router = express.Router();

// GET /api/results - Get all results (Admin only)
router.get("/", adminAuth, activityLogger("VIEW", "RESULTS"), getResults);

// GET /api/results/rankings - Get rankings (Authenticated users)
router.get("/rankings", auth, activityLogger("VIEW", "RANKINGS"), getRankings);

// GET /api/results/student - Get student's own results (Student only)
router.get(
  "/student",
  auth,
  activityLogger("VIEW", "STUDENT_RESULTS"),
  getStudentResults
);

// POST /api/results - Create new result (Admin only)
router.post(
  "/",
  adminAuth,
  resultValidation,
  activityLogger("CREATE", "RESULT"),
  createResult
);

// PUT /api/results/:id - Update result (Admin only)
router.put(
  "/:id",
  adminAuth,
  resultValidation,
  activityLogger("UPDATE", "RESULT"),
  updateResult
);

// DELETE /api/results/:id - Delete result (Admin only)
router.delete(
  "/:id",
  adminAuth,
  activityLogger("DELETE", "RESULT"),
  deleteResult
);

module.exports = router;
