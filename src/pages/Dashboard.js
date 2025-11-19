import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { resultAPI } from "../utils/api";
import StatsCard from "../components/dashboard/StatsCard";
import RankList from "../components/dashboard/RankList";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const [studentResults, setStudentResults] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averagePercentage: 0,
    highestGrade: "N/A",
    currentSemester: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === "student" && user?.studentId) {
        const [resultsData, rankingsData] = await Promise.all([
          resultAPI.getStudentResults(),
          resultAPI.getRankings({ semester: 1 }),
        ]);

        setStudentResults(resultsData.data || []);
        setRankings(rankingsData.data || []);

        // Calculate student stats
        if (resultsData.data && resultsData.data.length > 0) {
          calculateStudentStats(resultsData.data);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentStats = (results) => {
    const totalSubjects = results.reduce(
      (sum, result) => sum + result.subjects.length,
      0
    );
    const averagePercentage =
      results.reduce((sum, result) => sum + result.percentage, 0) /
      results.length;
    const highestGrade = results.reduce((highest, result) => {
      return result.percentage > highest.percentage ? result : highest;
    }, results[0]);
    const currentSemester = Math.max(
      ...results.map((result) => result.semester)
    );

    setStats({
      totalSubjects,
      averagePercentage: averagePercentage.toFixed(2),
      highestGrade: highestGrade.grade,
      currentSemester,
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (user?.role === "student") {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1>Student Dashboard</h1>
          <p>
            Welcome back, {user.username}! Here's your academic performance.
          </p>
        </div>

        {/* Student Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Current Semester"
            value={stats.currentSemester || "N/A"}
            icon="📚"
            color="blue"
          />
          <StatsCard
            title="Average Percentage"
            value={
              stats.averagePercentage ? `${stats.averagePercentage}%` : "N/A"
            }
            icon="📊"
            color="green"
          />
          <StatsCard
            title="Highest Grade"
            value={stats.highestGrade}
            icon="⭐"
            color="purple"
          />
          <StatsCard
            title="Total Subjects"
            value={stats.totalSubjects}
            icon="📖"
            color="orange"
          />
        </div>

        <div className="dashboard-content">
          {/* Student Results Section */}
          <div className="results-section">
            <h2>Your Academic Results</h2>
            {studentResults.length === 0 ? (
              <div className="empty-state">
                <p>No results found for your account.</p>
                <p>
                  Please contact administration if you believe this is an error.
                </p>
              </div>
            ) : (
              <div className="results-grid">
                {studentResults.map((result) => (
                  <div key={result._id} className="result-summary-card">
                    <div className="result-header">
                      <h3>Semester {result.semester}</h3>
                      <div className="result-meta">
                        <span className="rank">
                          Rank: {result.rank || "N/A"}
                        </span>
                        <span className={`grade grade-${result.grade}`}>
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

                    <div className="subject-preview">
                      <strong>Subjects:</strong>
                      <div className="subject-list">
                        {result.subjects.slice(0, 3).map((subject, index) => (
                          <span key={index} className="subject-tag">
                            {subject.subjectName} ({subject.marks})
                          </span>
                        ))}
                        {result.subjects.length > 3 && (
                          <span className="more-subjects">
                            +{result.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rankings Section */}
          <div className="rankings-section">
            <RankList
              rankings={rankings.slice(0, 5)}
              title="Top Performers - Semester 1"
            />
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard code remains the same...
  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the administration panel</p>
      </div>
      {/* Admin content... */}
    </div>
  );
};

export default Dashboard;
