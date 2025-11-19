const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const studentValidation = [
  body("studentId").notEmpty().withMessage("Student ID is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
  body("phone").isMobilePhone().withMessage("Valid phone number is required"),
  handleValidationErrors,
];

const resultValidation = [
  body("student").notEmpty().withMessage("Student ID is required"),
  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
  body("subjects")
    .isArray({ min: 1 })
    .withMessage("At least one subject is required"),
  body("subjects.*.subjectName")
    .notEmpty()
    .withMessage("Subject name is required"),
  body("subjects.*.marks")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Marks must be between 0 and 100"),
  body("subjects.*.credit")
    .isInt({ min: 1, max: 5 })
    .withMessage("Credit must be between 1 and 5"),
  handleValidationErrors,
];

const userValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

module.exports = {
  studentValidation,
  resultValidation,
  userValidation,
};
