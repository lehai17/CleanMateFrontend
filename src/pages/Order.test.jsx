import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Order from "./Order";
import { getOrders, deleteOrder } from "../api/bookings";

jest.mock("../api/bookings", () => ({ getOrders: jest.fn(), deleteOrder: jest.fn() }));
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
