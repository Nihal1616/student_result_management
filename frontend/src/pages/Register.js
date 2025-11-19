import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Student Result Management System</h1>
          <p>Create your student account to access your results</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
