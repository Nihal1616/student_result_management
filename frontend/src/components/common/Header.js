import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Student Result Management System</h1>
        <div className="header-actions">
          <span className="user-info">
            Welcome, {user?.username} ({user?.role})
          </span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
