import axios from "axios";

// 🔹 Ưu tiên đọc từ biến môi trường (chuẩn cho Create React App)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5238";
// const API_BASE = "http://localhost:5238";

console.log("[CONFIG] API_BASE =", API_BASE);

// 🔹 Tạo instance mặc định
export const api = axios.create({
  baseURL: API_BASE,
});

// 🔹 Gắn token Authorization nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cm_token");

  console.log("Token từ localStorage:", token); // Log để kiểm tra token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token found in localStorage.");
  }

  config.headers["Content-Type"] = "application/json";

  // Debug log
  console.log(
    "[API] ->",
    config.method?.toUpperCase(),
    config.baseURL + config.url,
    "Auth:",
    config.headers.Authorization
  );

  return config;
});
