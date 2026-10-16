import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Notifications from "./Notifications";
import { getNotifications, readNotification, readAllNotifications } from "../api/notifications";

jest.mock("react-router-dom", () => ({ Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock("../api/notifications", () => ({ getNotifications: jest.fn(), readNotification: jest.fn(), readAllNotifications: jest.fn() }));
const mockRefresh = jest.fn();
jest.mock("../context/NotificationContext", () => ({ useNotifications: () => ({ refresh: mockRefresh }) }));
const notice = (id, target = "Orders") => ({ id, bookingId: 7, title: `Notice ${id}`, message: "Booking update", createdAt: "2026-10-16T01:00:00Z", readAt: null, target });
let container, root;
beforeEach(() => {
  jest.clearAllMocks(); container = document.createElement("div"); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); });
const button = title => [...container.querySelectorAll("button")].find(b => b.textContent === title);

test("inbox marks one then all read using its newest item boundary and links to the correct work area", async () => {
  getNotifications.mockResolvedValue({ items: [notice(9), notice(8, "CleanerJobs")], unreadCount: 2, nextBeforeId: null });
  readNotification.mockResolvedValue({ id: 9, readAt: "2026-10-16T02:00:00Z", unreadCount: 1 });
  readAllNotifications.mockResolvedValue({ readAt: "2026-10-16T03:00:00Z", unreadCount: 0 });
  await act(async () => root.render(<Notifications />));
  expect([...container.querySelectorAll("a")].map(a => a.getAttribute("href"))).toEqual(["/orders", "/cleaner/jobs"]);
  await act(async () => button("Đánh dấu đã đọc").click());
  expect(readNotification).toHaveBeenCalledWith(9);
  expect(container.textContent).toContain("Chưa đọc: 1");
  await act(async () => button("Đánh dấu tất cả đã đọc").click());
  expect(readAllNotifications).toHaveBeenCalledWith(9);
  expect(container.textContent).toContain("Chưa đọc: 0");
  expect(button("Đánh dấu đã đọc")).toBeUndefined();
  expect(mockRefresh).toHaveBeenCalledTimes(2);
});

test("load failures expose retry and failed read actions retain unread state", async () => {
  getNotifications.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ items: [notice(5)], unreadCount: 1, nextBeforeId: null });
  readNotification.mockRejectedValue(new Error("offline"));
  await act(async () => root.render(<Notifications />));
  expect(container.textContent).toContain("Không thể tải thông báo");
  expect(container.textContent).not.toContain("Bạn chưa có thông báo");
  await act(async () => button("Tải lại thông báo").click());
  await act(async () => button("Đánh dấu đã đọc").click());
  expect(container.textContent).toContain("Không thể đánh dấu đã đọc");
  expect(container.textContent).toContain("Chưa đọc: 1");
  expect(button("Đánh dấu đã đọc")).toBeDefined();
});

test("loading older notifications appends a page without losing the newest read-all boundary", async () => {
  getNotifications.mockResolvedValueOnce({ items: [notice(30)], unreadCount: 2, nextBeforeId: 30 })
    .mockResolvedValueOnce({ items: [notice(20)], unreadCount: 2, nextBeforeId: null });
  readAllNotifications.mockResolvedValue({ readAt: "2026-10-16T03:00:00Z", unreadCount: 0 });
  await act(async () => root.render(<Notifications />));
  await act(async () => button("Xem thêm").click());
  expect(getNotifications).toHaveBeenLastCalledWith(30);
  expect(container.querySelectorAll("article")).toHaveLength(2);
  await act(async () => button("Đánh dấu tất cả đã đọc").click());
  expect(readAllNotifications).toHaveBeenCalledWith(30);
});
