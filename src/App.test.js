import React, { act } from "react";
import { createRoot } from "react-dom/client";
import PaymentQR from "./pages/PaymentQR";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

test("legacy payment page directs users to orders without self-confirming payment", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(<PaymentQR />); });
  expect(container.textContent).toContain("Thanh toán tiền mặt trực tiếp");
  expect(container.querySelector("button")).toBeNull();
  expect(container.querySelector("a").getAttribute("href")).toBe("/orders");
  await act(async () => root.unmount());
});
