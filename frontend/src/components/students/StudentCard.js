import React from "react";
import { formatDate } from "../../utils/helpers";

const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <div className="student-card">
      <div className="student-info">
        <h3>{student.name}</h3>
        <p>
          <strong>ID:</strong> {student.studentId}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Department:</strong> {student.department}
        </p>
        <p>
          <strong>Semester:</strong> {student.semester}
        </p>
        <p>
          <strong>Phone:</strong> {student.phone}
        </p>
        <p>
          <strong>Joined:</strong> {formatDate(student.createdAt)}
        </p>
      </div>

      <div className="student-actions">
        <button onClick={() => onEdit(student)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(student._id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
