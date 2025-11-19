const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, studentId } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let student = null;
    if (role === "student") {
      student = await Student.findOne({ studentId });
      if (!student) {
        return res.status(400).json({ message: "Student ID not found" });
      }
    }

    user = new User({
      username,
      email,
      password,
      role,
      studentId: student ? student._id : undefined,
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Allow login by email or username (frontend sends 'email' field)
    const user = await User.findOne({ $or: [{ email }, { username: email }] }).populate("studentId");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await user.correctPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("studentId")
      .select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
