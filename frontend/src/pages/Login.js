import React from "react";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Student Result Management System</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>
        <LoginForm />
        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
