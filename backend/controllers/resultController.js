const Result = require("../models/Result");
const Student = require("../models/Student");

// Get all results (admin)
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().populate("student").sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error("Error getting results:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get rankings (authenticated users)
exports.getRankings = async (req, res) => {
  try {
    // Simple ranking by percentage descending
    const rankings = await Result.find()
      .populate("student")
      .sort({ percentage: -1, totalMarks: -1 });

    // Convert to plain objects and attach rank number at top-level so frontend
    // can access fields like student.name directly (matches RankList expectations)
    const ranked = rankings.map((r, idx) => {
      const obj = r && typeof r.toObject === "function" ? r.toObject() : r;
      if (obj) obj.rank = idx + 1;
      return obj;
    });

    res.json(ranked);
  } catch (error) {
    console.error("Error getting rankings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get student's own results
exports.getStudentResults = async (req, res) => {
  try {
    // Get studentId from the authenticated user
    const studentId = req.user.studentId
      ? req.user.studentId._id
      : req.user.studentId;

  // getting results for student

    if (!studentId) {
      return res.status(400).json({
        message:
          "No student ID associated with this account. Please contact administrator.",
      });
    }

    const results = await Result.find({ student: studentId })
      .populate("student")
      .sort({ semester: 1 });

  // found results count

    if (results.length === 0) {
      return res.status(404).json({
        message:
          "No results found for your account. Results may not be published yet.",
      });
    }

    res.json(results);
  } catch (error) {
    console.error("📊 Error getting student results:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new result (admin)
exports.createResult = async (req, res) => {
  try {
    const { student: studentId } = req.body;

    // ensure student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(400).json({ message: "Invalid student ID" });

    const newResult = new Result(req.body);
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a result (admin)
exports.updateResult = async (req, res) => {
  try {
    const updated = await Result.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("student");

    if (!updated) return res.status(404).json({ message: "Result not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a result (admin)
exports.deleteResult = async (req, res) => {
  try {
    const deleted = await Result.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Result not found" });
    res.json({ message: "Result deleted" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
