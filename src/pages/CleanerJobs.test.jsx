import React, { act } from "react";
import { createRoot } from "react-dom/client";
import CleanerJobs from "./CleanerJobs";
import { completeCleanerJob, getAvailableCleanerJobs, getMyCleanerJobs, startCleanerJob } from "../api/bookings";

jest.mock("../api/bookings", () => ({
  acceptCleanerJob: jest.fn(), getAvailableCleanerJobs: jest.fn(), getMyCleanerJobs: jest.fn(),
  startCleanerJob: jest.fn(), completeCleanerJob: jest.fn(),
}));

let container, root, jobs;
const startedAt = "2026-10-15T09:00:00Z";
const completedAt = "2026-10-15T10:00:00Z";
const button = (name) => [...container.querySelectorAll("button")].find(item => item.textContent === name);
beforeEach(() => {
  jest.clearAllMocks();
  jobs = [{ id: 42, customerName: "Customer", status: "Accepted", startTime: startedAt, durationHours: 1, price: 70000 }];
  getAvailableCleanerJobs.mockResolvedValue([]);
  getMyCleanerJobs.mockImplementation(async () => jobs);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });

test("assigned work advances in order and completed work has no further actions", async () => {
  startCleanerJob.mockImplementation(async () => { jobs = [{ ...jobs[0], status: "InProgress", startedAt }]; });
  completeCleanerJob.mockImplementation(async () => { jobs = [{ ...jobs[0], status: "Completed", completedAt }]; });
  await act(async () => root.render(<CleanerJobs />));
  expect(button("Bắt đầu công việc")).toBeDefined();
  expect(button("Hoàn thành công việc")).toBeUndefined();
  await act(async () => button("Bắt đầu công việc").click());
  expect(startCleanerJob).toHaveBeenCalledWith(42);
  expect(container.textContent).toContain("InProgress");
  expect(container.textContent).toContain("Bắt đầu thực tế:");
  expect(button("Bắt đầu công việc")).toBeUndefined();
  await act(async () => button("Hoàn thành công việc").click());
  expect(completeCleanerJob).toHaveBeenCalledWith(42);
  expect(container.textContent).toContain("Completed");
  expect(container.textContent).toContain("Hoàn thành thực tế:");
  expect(container.querySelectorAll("article button")).toHaveLength(0);
});

test("a stale transition shows the server error and reloads the actual state", async () => {
  startCleanerJob.mockImplementation(async () => {
    jobs = [{ ...jobs[0], status: "InProgress", startedAt }];
    throw { response: { status: 409, data: { message: "Trạng thái đã thay đổi." } } };
  });
  await act(async () => root.render(<CleanerJobs />));
  await act(async () => button("Bắt đầu công việc").click());
  expect(container.textContent).toContain("Trạng thái đã thay đổi.");
  expect(container.textContent).not.toContain("Đã bắt đầu công việc.");
  expect(button("Hoàn thành công việc")).toBeDefined();
});

test("progress buttons stay disabled while an update is pending", async () => {
  let finish;
  startCleanerJob.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  await act(async () => root.render(<CleanerJobs />));
  await act(async () => button("Bắt đầu công việc").click());
  expect(button("Bắt đầu công việc").disabled).toBe(true);
  await act(async () => button("Bắt đầu công việc").click());
  expect(startCleanerJob).toHaveBeenCalledTimes(1);
  jobs = [{ ...jobs[0], status: "InProgress", startedAt }];
  await act(async () => finish());
  expect(button("Hoàn thành công việc").disabled).toBe(false);
});
