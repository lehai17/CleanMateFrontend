import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5238",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
