import React from "react";
import { getGradeColor } from "../../utils/helpers";

const ResultCard = ({ result, onEdit, onDelete }) => {
  return (
    <div className="result-card">
      <div className="result-header">
        <h3>
          {result.student.name} - Semester {result.semester}
        </h3>
        <div className="result-meta">
          <span className="rank">Rank: {result.rank}</span>
          <span
            className="grade"
            style={{ backgroundColor: getGradeColor(result.grade) }}
          >
            {result.grade}
          </span>
        </div>
      </div>

      <div className="result-stats">
        <div className="stat">
          <label>Total Marks</label>
          <span>{result.totalMarks}</span>
        </div>
        <div className="stat">
          <label>Percentage</label>
          <span>{result.percentage.toFixed(2)}%</span>
        </div>
        <div className="stat">
          <label>Subjects</label>
          <span>{result.subjects.length}</span>
        </div>
      </div>

      <div className="subjects-list">
        <h4>Subjects:</h4>
        {result.subjects.map((subject, index) => (
          <div key={index} className="subject-item">
            <span className="subject-name">{subject.subjectName}</span>
            <span className="subject-marks">
              {subject.marks}/100 (Credit: {subject.credit})
            </span>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button onClick={() => onEdit(result)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(result._id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
