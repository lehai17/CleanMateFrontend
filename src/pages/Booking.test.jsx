import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Booking from "./Booking";
import { createBooking } from "../api/bookings";

const mockLocation = { state: null };
jest.mock("react-router-dom", () => ({
  useLocation: () => mockLocation,
  useNavigate: () => jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { fullName: "Customer", phoneNumber: "0901234567", email: "customer@example.test", address: "123 Test Street" } }),
}));
jest.mock("../api/bookings", () => ({ createBooking: jest.fn() }));

let container, root;
beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  const day = new Date();
  day.setDate(day.getDate() + 2);
  mockLocation.state = {
    goToStep: 4,
    booking: { serviceName: "Dọn Dẹp Tổng Quát", date: day.toISOString().slice(0, 10),
      time: "09:00", duration: 2, paymentMethod: "cash", name: "Customer",
      phone: "0901234567", email: "customer@example.test", address: "123 Test Street" },
  };
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
async function confirm() {
  const button = [...container.querySelectorAll("button")].find(b => b.textContent.includes("Xác nhận đặt lịch"));
  expect(button).toBeDefined();
  await act(async () => button.click());
}

test("booking sends service and UTC time, leaving price and ownership to the backend", async () => {
  createBooking.mockResolvedValue({ id: 42, price: 140000, status: "Pending" });
  await act(async () => root.render(<Booking />));
  await confirm();
  const payload = createBooking.mock.calls[0][0];
  expect(payload.ServiceKey).toBe("cleaning");
  expect(payload.DurationHours).toBe(2);
  expect(payload.PaymentMethod).toBe("cash");
  expect(payload.StartTime.endsWith("Z")).toBe(true);
  expect(payload).not.toHaveProperty("Price");
  expect(payload).not.toHaveProperty("CleanerId");
  expect(payload).not.toHaveProperty("UserId");
  expect(container.textContent).toContain("CM000042");
});
test("backend validation errors are shown without a success screen", async () => {
  createBooking.mockRejectedValue({ response: { data: { message: "Thời gian không hợp lệ." } } });
  jest.spyOn(console, "error").mockImplementation(() => {});
  await act(async () => root.render(<Booking />));
  await confirm();
  expect(window.alert).toHaveBeenCalledWith("Thời gian không hợp lệ.");
  expect(container.textContent).not.toContain("Đặt lịch thành công!");
  console.error.mockRestore();
});
test("customer cannot select online payment", async () => {
  mockLocation.state.goToStep = 3;
  await act(async () => root.render(<Booking />));
  expect(container.querySelector('input[value="online"]').disabled).toBe(true);
  expect(container.querySelector('input[value="cash"]').checked).toBe(true);
});
