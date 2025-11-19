import React from "react";
import StudentCard from "./StudentCard";
import LoadingSpinner from "../common/LoadingSpinner";

const StudentList = ({
  students,
  loading,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
}) => {
  if (loading) {
    return <LoadingSpinner text="Loading students..." />;
  }

  return (
    <div className="student-list">
      <div className="list-header">
        <h2>Students ({students.length})</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students found.</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;
