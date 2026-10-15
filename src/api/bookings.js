import { api } from "./axios";

export async function createBooking(payload) {
  const { data } = await api.post("/api/bookings", payload);
  return data;
}

export async function getOrders() {
  const { data } = await api.get("/api/orders");
  return data;
}

export async function deleteOrder(id) {
  await api.put(`/api/orders/${id}/cancel`);
}

export async function getAvailableCleanerJobs() {
  const { data } = await api.get("/api/cleaner/jobs/available");
  return data;
}

export async function getMyCleanerJobs() {
  const { data } = await api.get("/api/cleaner/jobs/mine");
  return data;
}

export async function acceptCleanerJob(id) {
  const { data } = await api.put(`/api/cleaner/jobs/${id}/accept`);
  return data;
}

export async function startCleanerJob(id) {
  const { data } = await api.put(`/api/cleaner/jobs/${id}/start`);
  return data;
}

export async function completeCleanerJob(id) {
  const { data } = await api.put(`/api/cleaner/jobs/${id}/complete`);
  return data;
}
