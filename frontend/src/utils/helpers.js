import { GRADE_SCALE } from "./constants";

export const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

export const calculateGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;

  const totalPoints = subjects.reduce((sum, subject) => {
    const grade = calculateGrade(subject.marks);
    return sum + (GRADE_SCALE[grade]?.points || 0) * subject.credit;
  }, 0);

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credit,
    0
  );

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getGradeColor = (grade) => {
  const colors = {
    "A+": "#10b981",
    A: "#22c55e",
    B: "#eab308",
    C: "#f59e0b",
    D: "#f97316",
    F: "#ef4444",
  };
  return colors[grade] || "#6b7280";
};
