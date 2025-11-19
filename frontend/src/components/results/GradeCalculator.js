import React from "react";
import {
  calculateGrade,
  calculateGPA,
  getGradeColor,
} from "../../utils/helpers";

const GradeCalculator = ({ subjects }) => {
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const percentage = (totalMarks / (subjects.length * 100)) * 100;
  const grade = calculateGrade(percentage);
  const gpa = calculateGPA(subjects);

  return (
    <div className="grade-calculator">
      <h4>Performance Summary</h4>
      <div className="performance-stats">
        <div className="stat">
          <label>Total Marks</label>
          <span>{totalMarks.toFixed(2)}</span>
        </div>
        <div className="stat">
          <label>Percentage</label>
          <span>{percentage.toFixed(2)}%</span>
        </div>
        <div className="stat">
          <label>Grade</label>
          <span
            className="grade-badge"
            style={{ backgroundColor: getGradeColor(grade) }}
          >
            {grade}
          </span>
        </div>
        <div className="stat">
          <label>GPA</label>
          <span>{gpa}</span>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;
