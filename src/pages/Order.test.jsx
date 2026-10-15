import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Order from "./Order";
import { getOrders, deleteOrder, confirmOrderCompletion } from "../api/bookings";

jest.mock("../api/bookings", () => ({ getOrders: jest.fn(), deleteOrder: jest.fn(), confirmOrderCompletion: jest.fn() }));
beforeEach(() => jest.clearAllMocks());

test("refresh shows the assigned cleaner contact and avoids unusable call links", async () => {
  getOrders.mockResolvedValueOnce([
    { id: 1, status: "Pending", cleaner: null },
    { id: 2, status: "Accepted", cleaner: { name: "No Phone Cleaner", phoneNumber: null } },
    { id: 3, status: "Accepted", cleaner: { name: "Invalid Phone Cleaner", phoneNumber: "*123#" } },
  ]).mockResolvedValueOnce([
    { id: 1, status: "Accepted", contactName: "Person at home", contactPhone: "0907777777", cleaner: { name: "Assigned Cleaner", phoneNumber: "+84 901 234 567" } },
  ]);
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () => root.render(<Order />));
    expect(container.textContent).toContain("Chưa có cleaner nhận việc");
    expect(container.textContent).toContain("No Phone Cleaner");
    expect(container.textContent).toContain("Chưa cập nhật số điện thoại");
    expect(container.querySelectorAll('a[href^="tel:"]')).toHaveLength(0);
    await act(async () => [...container.querySelectorAll("button")].find(b => b.textContent === "Tải lại trạng thái").click());
    expect(getOrders).toHaveBeenCalledTimes(2);
    expect(container.textContent).toContain("Assigned Cleaner");
    expect(container.textContent).toContain("Người liên hệ: Person at home");
    expect(container.textContent).toContain("SĐT liên hệ: 0907777777");
    expect(container.textContent).toContain("+84 901 234 567");
    expect(container.querySelector('a[href^="tel:"]').getAttribute("href")).toBe("tel:+84901234567");
    expect(container.textContent).not.toContain("Chưa có cleaner nhận việc");
  } finally { await act(async () => root.unmount()); }
});
test("cancellation preserves the visible order and disables further cancellation", async () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  getOrders.mockResolvedValue([
    { id: 1, date: future, status: "Pending", price: 140000 },
    { id: 2, date: future, status: "Accepted", price: 140000 },
  ]);
  deleteOrder.mockResolvedValue();
  window.confirm = jest.fn(() => true);
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => root.render(<Order />));
  const buttons = container.querySelectorAll("tbody button");
  expect(buttons[0].disabled).toBe(false);
  expect(buttons[1].disabled).toBe(true);
  await act(async () => buttons[0].click());
  expect(deleteOrder).toHaveBeenCalledWith(1);
  expect(container.querySelectorAll("tbody tr").length).toBe(2);
  expect(container.querySelector("tbody tr").textContent).toContain("Cancelled");
  expect(container.querySelector("tbody button").disabled).toBe(true);
  await act(async () => root.unmount());
});

test("customer feedback confirms work without claiming cash was received", async () => {
  getOrders.mockResolvedValue([{ id: 7, status: "Completed", price: 140000, paymentMethod: "cash", paymentStatus: "Unpaid" }]);
  confirmOrderCompletion.mockResolvedValue({ id: 7, customerConfirmedAt: "2026-10-15T10:00:00Z", customerRating: 5, customerReview: "Good work" });
  const container = document.createElement("div");
  const root = createRoot(container);
  const button = name => [...container.querySelectorAll("button")].find(b => b.textContent === name);
  try {
    await act(async () => root.render(<Order />));
    expect(container.textContent).toContain("CleanMate chỉ kết nối dịch vụ");
    expect(container.querySelectorAll("a")).toHaveLength(0);
    await act(async () => button("Xác nhận và đánh giá").click());
    expect(button("Gửi đánh giá").disabled).toBe(true);
    const select = container.querySelector("select");
    await act(async () => { select.value = "5"; select.dispatchEvent(new Event("change", { bubbles: true })); });
    await act(async () => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(confirmOrderCompletion).toHaveBeenCalledWith(7, { rating: 5, review: "" });
    expect(container.textContent).toContain("Khách đã xác nhận hoàn thành");
    expect(container.textContent).toContain("Đánh giá: 5/5 sao");
    expect(container.textContent).toContain("Chưa có xác nhận nhận tiền mặt");
    expect(button("Xác nhận và đánh giá")).toBeUndefined();
  } finally { await act(async () => root.unmount()); }
});

test("failed feedback remains editable and does not invent confirmation", async () => {
  getOrders.mockResolvedValue([{ id: 8, status: "Completed", paymentMethod: "cash", paymentStatus: "Unpaid" }]);
  confirmOrderCompletion.mockRejectedValue({ response: { data: { message: "Không thể gửi đánh giá." } } });
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () => root.render(<Order />));
    await act(async () => [...container.querySelectorAll("button")].find(b => b.textContent === "Xác nhận và đánh giá").click());
    await act(async () => { const select = container.querySelector("select"); select.value = "4"; select.dispatchEvent(new Event("change", { bubbles: true })); });
    await act(async () => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(container.textContent).toContain("Không thể gửi đánh giá.");
    expect(container.textContent).not.toContain("Khách đã xác nhận hoàn thành");
    expect(container.querySelector("select").value).toBe("4");
  } finally { await act(async () => root.unmount()); }
});
