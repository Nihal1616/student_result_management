import React from "react";
import { getGradeColor } from "../../utils/helpers";

const RankList = ({ rankings, title }) => {
  const topRankings = Array.isArray(rankings) ? rankings.slice(0, 10) : [];

  return (
    <div className="rank-list">
      <h3>{title}</h3>
      <div className="rankings">
        {topRankings.map((result, index) => {
          const s = result && result.student ? result.student : {};
          const name = s.name || "Unknown";
          const department = s.department || "-";
          const semester = result?.semester ?? "-";
          const percentage = typeof result?.percentage === "number" ? result.percentage.toFixed(2) + "%" : "-";
          const grade = result?.grade || "-";

          return (
            <div key={result?._id || index} className="rank-item">
              <div className="rank-position">#{index + 1}</div>
              <div className="student-info">
                <h4>{name}</h4>
                <p>
                  {department} - Sem {semester}
                </p>
              </div>
              <div className="performance">
                <span className="percentage">{percentage}</span>
                <span className="grade" style={{ backgroundColor: getGradeColor(grade) }}>{grade}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankList;
