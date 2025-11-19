import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { resultAPI } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Profile = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.studentId) {
      loadStudentResults();
    } else {
      // No student linked or not logged in — stop local loading spinner
      setLoading(false);
    }
  }, [user]);

  const loadStudentResults = async () => {
    try {
      const response = await resultAPI.getStudentResults();
      setResults(response.data);
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>
        <div className="profile-content">
          <div className="profile-info">
            <h2>Personal Information</h2>
            <div className="empty-state">You are not logged in. Please log in to view your profile.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Role</label>
              <span>{user.role}</span>
            </div>
            {user.studentId ? (
              typeof user.studentId === "object" ? (
                <>
                  <div className="info-item">
                    <label>Student ID</label>
                    <span>{user.studentId.studentId}</span>
                  </div>
                  <div className="info-item">
                    <label>Name</label>
                    <span>{user.studentId.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <span>{user.studentId.department}</span>
                  </div>
                  <div className="info-item">
                    <label>Semester</label>
                    <span>{user.studentId.semester}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-item">
                    <label>Student ID</label>
                    <span>{user.studentId}</span>
                  </div>
                  <div className="info-item">
                    <label>Student Details</label>
                    <span>Details not available. Refreshing your profile may help.</span>
                  </div>
                </>
              )
            ) : null}
          </div>
        </div>

        <div className="academic-performance">
          <h2>Academic Performance</h2>
          {results.length === 0 ? (
            <p>No results available.</p>
          ) : (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Rank</th>
                    <th>Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td>{result.semester}</td>
                      <td>{result.totalMarks}</td>
                      <td>{result.percentage.toFixed(2)}%</td>
                      <td>{result.grade}</td>
                      <td>{result.rank}</td>
                      <td>{result.subjects.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
