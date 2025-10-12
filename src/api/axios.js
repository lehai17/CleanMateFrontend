import axios from "axios";

// 🔹 Tự chọn baseURL theo môi trường
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://cleanmate-api.onrender.com"
    : "http://localhost:5238";

console.log("[CONFIG] API_BASE =", API_BASE);

export const api = axios.create({
  baseURL: API_BASE,
});

// 🔹 Gắn token Authorization nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Content-Type"] = "application/json";

  // Debug
  console.log(
    "[API] ->",
    config.method?.toUpperCase(),
    config.url,
    "Auth:",
    config.headers.Authorization
  );
  return config;
});
