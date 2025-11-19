import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      authAPI.setToken(token);
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to get current user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Login attempt for:", email);
      const response = await authAPI.login(email, password);
      console.log("Login API response:", response);

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      authAPI.setToken(newToken);
      setToken(newToken);
      // Set the token first, then refresh the current user from the server
      // so we get populated student data (auth API's /me populates studentId).
      setUser(userData); // optimistic set
      console.log("User set in context (optimistic):", userData);

      // Refresh user to ensure nested relations like studentId are populated
      try {
        await getCurrentUser();
        console.log("Refreshed current user after login");
      } catch (e) {
        console.warn("Failed to refresh user after login:", e);
      }
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // In your existing AuthContext.js, add this register function:
  const register = async (userData) => {
    try {
      console.log("Register attempt:", userData);
      const response = await authAPI.register(userData);
      console.log("Register response:", response.data);

      const { token: newToken, user: registeredUser } = response.data;

      localStorage.setItem("token", newToken);
      authAPI.setToken(newToken);
      setToken(newToken);
      setUser(registeredUser);
      // Refresh to obtain populated relations
      try {
        await getCurrentUser();
      } catch (e) {
        console.warn("Failed to refresh user after register:", e);
      }

      console.log("User registered and set in context:", registeredUser);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    authAPI.setToken(null);
    setToken(null);
    setUser(null);
  };

  // Make sure to include register in the value object:
  const value = {
    user,
    loading,
    login,
    register, // Add this line
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
