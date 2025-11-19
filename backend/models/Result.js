const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    subjects: [
      {
        subjectName: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        credit: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      default: "F",
    },
    rank: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total marks and percentage before saving
resultSchema.pre("save", function (next) {
  this.totalMarks = this.subjects.reduce(
    (sum, subject) => sum + subject.marks,
    0
  );
  this.percentage = (this.totalMarks / (this.subjects.length * 100)) * 100;

  // Calculate grade
  if (this.percentage >= 90) this.grade = "A+";
  else if (this.percentage >= 80) this.grade = "A";
  else if (this.percentage >= 70) this.grade = "B";
  else if (this.percentage >= 60) this.grade = "C";
  else if (this.percentage >= 50) this.grade = "D";
  else this.grade = "F";

  next();
});

module.exports = mongoose.model("Result", resultSchema);
