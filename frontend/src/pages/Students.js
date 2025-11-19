import React, { useState, useEffect } from "react";
import StudentList from "../components/students/StudentList";
import StudentForm from "../components/students/StudentForm";
import Modal from "../components/common/Modal";
import { studentAPI } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, [searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll({ search: searchTerm });
      setStudents(response.data.students);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (studentData) => {
    try {
      await studentAPI.create(studentData);
      setShowModal(false);
      loadStudents();
    } catch (error) {
      console.error("Failed to create student:", error);
      alert(
        "Failed to create student: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      await studentAPI.update(editingStudent._id, studentData);
      setShowModal(false);
      setEditingStudent(null);
      loadStudents();
    } catch (error) {
      console.error("Failed to update student:", error);
      alert(
        "Failed to update student: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentAPI.delete(studentId);
        loadStudents();
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert(
          "Failed to delete student: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          Add New Student
        </button>
      </div>

      <StudentList
        students={students}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteStudent}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        size="large"
      >
        <StudentForm
          student={editingStudent}
          onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Students;
