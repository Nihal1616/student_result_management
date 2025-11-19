import React, { useState, useEffect } from "react";
import { SEMESTERS } from "../../utils/constants";

const ResultForm = ({ result, students, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    student: "",
    semester: 1,
    subjects: [{ subjectName: "", marks: "", credit: 1 }],
  });

  useEffect(() => {
    if (result) {
      setFormData({
        student: result.student._id,
        semester: result.semester,
        subjects: result.subjects,
      });
    }
  }, [result]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = field === "credit" ? parseInt(value) : value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { subjectName: "", marks: "", credit: 1 },
      ],
    });
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      const newSubjects = formData.subjects.filter((_, i) => i !== index);
      setFormData({ ...formData, subjects: newSubjects });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert marks to numbers
    const submittedData = {
      ...formData,
      subjects: formData.subjects.map((subject) => ({
        ...subject,
        marks: parseFloat(subject.marks),
      })),
    };

    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="result-form">
      <div className="form-row">
        <div className="form-group">
          <label>Student *</label>
          <select
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
            disabled={!!result} // Cannot change student when editing
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.studentId})
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

      <div className="subjects-section">
        <div className="section-header">
          <h4>Subjects</h4>
          <button type="button" onClick={addSubject} className="add-btn">
            Add Subject
          </button>
        </div>

        {formData.subjects.map((subject, index) => (
          <div key={index} className="subject-row">
            <input
              type="text"
              placeholder="Subject Name"
              value={subject.subjectName}
              onChange={(e) =>
                handleSubjectChange(index, "subjectName", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Marks (0-100)"
              min="0"
              max="100"
              step="0.01"
              value={subject.marks}
              onChange={(e) =>
                handleSubjectChange(index, "marks", e.target.value)
              }
              required
            />
            <select
              value={subject.credit}
              onChange={(e) =>
                handleSubjectChange(index, "credit", e.target.value)
              }
            >
              {[1, 2, 3, 4, 5].map((credit) => (
                <option key={credit} value={credit}>
                  {credit} Credit
                </option>
              ))}
            </select>
            {formData.subjects.length > 1 && (
              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="remove-btn"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {result ? "Update Result" : "Add Result"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResultForm;
