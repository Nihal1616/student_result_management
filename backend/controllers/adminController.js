const Student = require("../models/Student");
const Result = require("../models/Result");
const User = require("../models/User");
const Log = require("../models/Log");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalResults = await Result.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get results by grade distribution
    const gradeDistribution = await Result.aggregate([
      {
        $group: {
          _id: "$grade",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activities
    const recentActivities = await Log.find()
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get department-wise student count
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalStudents,
      totalResults,
      totalUsers,
      gradeDistribution,
      departmentStats,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    // Semester-wise average percentage
    const semesterStats = await Result.aggregate([
      {
        $group: {
          _id: "$semester",
          averagePercentage: { $avg: "$percentage" },
          totalStudents: { $sum: 1 },
          highestPercentage: { $max: "$percentage" },
          lowestPercentage: { $min: "$percentage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top performers
    const topPerformers = await Result.find()
      .populate("student")
      .sort({ percentage: -1 })
      .limit(5);

    // Recent results growth
    const resultsGrowth = await Result.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.json({
      semesterStats,
      topPerformers,
      resultsGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
