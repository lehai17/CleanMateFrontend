import { api } from "./axios";

export async function loginApi(email, password) {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });

    // Lưu token vào localStorage sau khi đăng nhập thành công
    localStorage.setItem("cm_token", data.token);

    console.log("Login Response:", data); // Log để kiểm tra response

    return data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error; // Đảm bảo lỗi được throw để bắt ở các phần gọi sau
  }
}

export async function registerApi(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data; // user info
}

export async function meApi() {
  const { data } = await api.get("/api/me");
  return data;
}
