import React, { useState, useEffect } from "react";
import ResultCard from "../components/results/ResultCard";
import ResultForm from "../components/results/ResultForm";
import Modal from "../components/common/Modal";
import { resultAPI, studentAPI } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resultsResponse, studentsResponse] = await Promise.all([
        resultAPI.getAll(),
        studentAPI.getAll(),
      ]);
      // Backend may return either an array (res.json(results)) or an object
      // { results: [...], ... } depending on implementation. Safely handle both.
      const resultsPayload = resultsResponse?.data;
      let resultsArray = [];
      if (Array.isArray(resultsPayload)) resultsArray = resultsPayload;
      else if (Array.isArray(resultsPayload?.results)) resultsArray = resultsPayload.results;
      else resultsArray = [];

      const studentsPayload = studentsResponse?.data;
      let studentsArray = [];
      if (Array.isArray(studentsPayload)) studentsArray = studentsPayload;
      else if (Array.isArray(studentsPayload?.students)) studentsArray = studentsPayload.students;
      else studentsArray = [];

      setResults(resultsArray);
      setStudents(studentsArray);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResult = async (resultData) => {
    try {
      await resultAPI.create(resultData);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Failed to create result:", error);
      alert(
        "Failed to create result: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateResult = async (resultData) => {
    try {
      await resultAPI.update(editingResult._id, resultData);
      setShowModal(false);
      setEditingResult(null);
      loadData();
    } catch (error) {
      console.error("Failed to update result:", error);
      alert(
        "Failed to update result: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await resultAPI.delete(resultId);
        loadData();
      } catch (error) {
        console.error("Failed to delete result:", error);
        alert(
          "Failed to delete result: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingResult(null);
  };

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>Result Management</h1>
        <button onClick={() => setShowModal(true)} className="add-btn">
          Add New Result
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading results..." />
      ) : (
        <div className="results-list">
          {(Array.isArray(results) && results.length === 0) ? (
            <div className="empty-state">
              <p>No results found.</p>
            </div>
          ) : (
            <div className="results-grid">
              {(Array.isArray(results) ? results : []).map((result) => (
                <ResultCard
                  key={result._id}
                  result={result}
                  onEdit={handleEdit}
                  onDelete={handleDeleteResult}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingResult ? "Edit Result" : "Add New Result"}
        size="large"
      >
        <ResultForm
          result={editingResult}
          students={students}
          onSubmit={editingResult ? handleUpdateResult : handleCreateResult}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Results;
