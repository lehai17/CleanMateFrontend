import { api } from "./axios";

export async function loginApi(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function registerApi(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export async function meApi() {
  const { data } = await api.get("/api/me");
  return data;
}

export async function getProfileApi() {
  const { data } = await api.get("/api/profile");
  return data;
}

export async function updateProfileApi(payload) {
  const { data } = await api.put("/api/profile", payload);
  return data;
}

export async function registerCleanerApi(payload) {
  const { data } = await api.post("/api/profile/register-cleaner", payload);
  return data;
}

export async function resubmitCleanerApi(payload) {
  return (await api.put("/api/profile/cleaner-application", payload)).data;
}

export async function updateCleanerProfileApi(payload) {
  const { data } = await api.put("/api/cleaner/profile", payload);
  return data;
}
