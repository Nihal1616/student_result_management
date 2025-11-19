import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import "./styles/App.css";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import Results from "./pages/Results";
import Admin from "./pages/Admin";

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user ? (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main className="content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/students" element={<Students />} />
                <Route path="/results" element={<Results />} />
                <Route path="/admin" element={<Admin />} />
                {/* Add other protected routes here */}
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
