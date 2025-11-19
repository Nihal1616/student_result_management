import React, { useState, useEffect } from "react";
import { DEPARTMENTS, SEMESTERS } from "../../utils/constants";

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    department: "",
    semester: 1,
    phone: "",
    dateOfBirth: "",
    address: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        semester: student.semester,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth.split("T")[0],
        address: student.address,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-row">
        <div className="form-group">
          <label>Student ID *</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Semester *</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Date of Birth *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {student ? "Update Student" : "Add Student"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
