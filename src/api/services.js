import { api } from "./axios";
export const getServices = async () => (await api.get("/api/services")).data;
