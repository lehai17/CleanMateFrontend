import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Booking from "./Booking";
import { createBooking } from "../api/bookings";
import { getServices } from "../api/services";

const mockLocation = { state: null };
const mockUser = { fullName: "Customer", phoneNumber: "0901234567", email: "customer@example.test", address: "123 Test Street" };
jest.mock("react-router-dom", () => ({
  useLocation: () => mockLocation,
  useNavigate: () => jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));
jest.mock("../api/bookings", () => ({ createBooking: jest.fn() }));
jest.mock("../api/services", () => ({ getServices: jest.fn() }));

let container, root;
// jsdom lacks the browser's Web Crypto implementation; use Node's real one.
beforeAll(() => Object.defineProperty(window, "crypto", { value: require("crypto").webcrypto, configurable: true }));
beforeEach(() => {
  jest.clearAllMocks();
  getServices.mockResolvedValue([
    { key: "cleaning", name: "Dọn Dẹp Tổng Quát", hourlyRate: 70000, minHours: 1, maxHours: 8 },
    { key: "cooking", name: "Nấu Ăn & Rửa Bát", hourlyRate: 90000, minHours: 1, maxHours: 8 },
    { key: "laundry", name: "Giặt Ủi Quần Áo", hourlyRate: 70000, minHours: 1, maxHours: 8 },
    { key: "childcare", name: "Chăm Sóc Trẻ Em", hourlyRate: 100000, minHours: 1, maxHours: 8 },
  ]);
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
  expect(payload.ContactName).toBe("Customer");
  expect(payload.ContactPhone).toBe("0901234567");
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
  expect(container.querySelector('input[value="online"]')).toBeNull();
  expect(container.querySelector('input[value="cash"]').checked).toBe(true);
});

test("booking uses current catalog pricing and sends the displayed quote for confirmation", async () => {
  getServices.mockResolvedValueOnce([{ key: "cleaning", name: "Dọn Dẹp Tổng Quát", hourlyRate: 81000, minHours: 1, maxHours: 4 }]);
  createBooking.mockResolvedValue({ id: 45, price: 162000, status: "Pending" });
  await act(async () => root.render(<Booking />));
  await confirm();
  expect(createBooking.mock.calls[0][0].ExpectedPrice).toBe(162000);
  expect(container.textContent).toContain("CM000045");
});

test("catalog loading failures prevent booking with a hardcoded fallback price", async () => {
  getServices.mockRejectedValueOnce(new Error("offline"));
  await act(async () => root.render(<Booking />));
  expect(container.textContent).toContain("Không thể tải dịch vụ và giá");
  expect([...container.querySelectorAll("button")].some(b => b.textContent.includes("Xác nhận đặt lịch"))).toBe(false);
  expect(createBooking).not.toHaveBeenCalled();
});

test("rapid confirmation disables navigation and sends one booking while pending", async () => {
  let resolve;
  createBooking.mockImplementation(() => new Promise(done => { resolve = done; }));
  await act(async () => root.render(<Booking />));
  const button = [...container.querySelectorAll("button")].find(b => b.textContent.includes("Xác nhận đặt lịch"));
  await act(async () => { button.click(); button.click(); });
  expect(createBooking).toHaveBeenCalledTimes(1);
  expect(button.disabled).toBe(true);
  expect(container.textContent).toContain("Đang đặt lịch...");
  expect([...container.querySelectorAll("button")].find(b => b.textContent === "Quay lại").disabled).toBe(true);
  await act(async () => resolve({ id: 43 }));
  expect(container.textContent).toContain("CM000043");
});

test("retry after a lost response keeps the same request key", async () => {
  createBooking.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({ id: 44 });
  const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    await act(async () => root.render(<Booking />));
    await confirm();
    await confirm();
    expect(createBooking).toHaveBeenCalledTimes(2);
    expect(createBooking.mock.calls[0][0].RequestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(createBooking.mock.calls[1][0]).toEqual(createBooking.mock.calls[0][0]);
    expect(container.textContent).toContain("CM000044");
  } finally { errorLog.mockRestore(); }
});
