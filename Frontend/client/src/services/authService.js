import api from "./api.js";

// Register user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
