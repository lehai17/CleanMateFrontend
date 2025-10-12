import { api } from "./axios";

export async function loginApi(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data; // { token, user }
}

export async function registerApi(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data; // user info
}

export async function meApi() {
  const { data } = await api.get("/api/me");
  return data;
}
