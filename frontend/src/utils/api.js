import axios from "axios";

const API_BASE_URL = "https://student-result-management-lhmn.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },

  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (userData) => api.post("/auth/register", userData),

  getMe: () => api.get("/auth/me"),
};

export const studentAPI = {
  getAll: (params) => api.get("/students", { params }),

  getById: (id) => api.get(`/students/${id}`),

  create: (studentData) => api.post("/students", studentData),

  update: (id, studentData) => api.put(`/students/${id}`, studentData),

  delete: (id) => api.delete(`/students/${id}`),
};

export const resultAPI = {
  getAll: (params) => api.get("/results", { params }),

  // Backend exposes GET /results/student which returns results for the
  // authenticated user (no studentId path param required).
  getStudentResults: (studentId) => api.get(`/results/student`),

  getRankings: (semester) =>
    api.get("/results/rankings", { params: { semester } }),

  create: (resultData) => api.post("/results", resultData),

  update: (id, resultData) => api.put(`/results/${id}`, resultData),

  delete: (id) => api.delete(`/results/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  getAnalytics: (params) => api.get("/admin/analytics", { params }),
};

export default api;
