import React, { act } from "react";
import { createRoot } from "react-dom/client";
import PaymentQR from "./pages/PaymentQR";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

test("online payment cannot be self-confirmed while only cash is supported", async () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  await act(async () => { root.render(<PaymentQR />); });
  expect(container.textContent).toContain("Thanh toán online chưa được hỗ trợ");
  expect(container.querySelector("button")).toBeNull();
  expect(container.querySelector("a").getAttribute("href")).toBe("/booking");
  await act(async () => root.unmount());
});
