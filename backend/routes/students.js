const express = require("express");
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { adminAuth } = require("../middleware/auth");
const { studentValidation } = require("../middleware/validation");
const activityLogger = require("../middleware/logger");

const router = express.Router();

router.get("/", adminAuth, activityLogger("VIEW", "STUDENTS"), getAllStudents);
router.get("/:id", adminAuth, activityLogger("VIEW", "STUDENT"), getStudent);
router.post(
  "/",
  adminAuth,
  studentValidation,
  activityLogger("CREATE", "STUDENT"),
  createStudent
);
router.put(
  "/:id",
  adminAuth,
  studentValidation,
  activityLogger("UPDATE", "STUDENT"),
  updateStudent
);
router.delete(
  "/:id",
  adminAuth,
  activityLogger("DELETE", "STUDENT"),
  deleteStudent
);

module.exports = router;
