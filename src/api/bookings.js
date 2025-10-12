import { api } from "./axios";

export async function createBooking(payload) {
  const { data } = await api.post("/api/bookings", payload);
  return data;
}
