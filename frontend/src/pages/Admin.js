import React, { useState, useEffect } from "react";
import { adminAPI } from "../utils/api";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setError(error.response?.data?.message || error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }
  if (error) {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>Admin Analytics</h1>
          <p>Error loading analytics</p>
        </div>
        <div className="empty-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Analytics</h1>
        <p>Detailed analytics and insights</p>
      </div>

      <div className="analytics-content">
        <div className="chart-row">
          <div className="chart-container">
            <AnalyticsChart
              type="bar"
              title="Semester-wise Average Performance"
              data={{
                labels: analytics?.semesterStats?.map((s) => `Sem ${s._id}`),
                datasets: [
                  {
                    label: "Average Percentage",
                    data: analytics?.semesterStats?.map(
                      (s) => s.averagePercentage
                    ),
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="top-performers">
          <h3>Top Performers</h3>
          <div className="performers-list">
            {analytics?.topPerformers?.map((result, index) => (
              <div key={result._id} className="performer-card">
                <div className="rank">#{index + 1}</div>
                <div className="student-info">
                  <h4>{result.student.name}</h4>
                  <p>
                    {result.student.department} - Sem {result.semester}
                  </p>
                </div>
                <div className="performance">
                  <span className="percentage">
                    {result.percentage.toFixed(2)}%
                  </span>
                  <span className="grade">{result.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
