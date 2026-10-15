import React, { act } from "react";
import { createRoot } from "react-dom/client";
import CleanerJobs from "./CleanerJobs";
import { acceptCleanerJob, completeCleanerJob, confirmCashPayment, getAvailableCleanerJobs, getMyCleanerJobs, startCleanerJob } from "../api/bookings";

jest.mock("../api/bookings", () => ({
  acceptCleanerJob: jest.fn(), getAvailableCleanerJobs: jest.fn(), getMyCleanerJobs: jest.fn(),
  startCleanerJob: jest.fn(), completeCleanerJob: jest.fn(), confirmCashPayment: jest.fn(),
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

test("a running job disables starting another job until completion", async () => {
  jobs = [{ ...jobs[0], status: "InProgress", startedAt }, { ...jobs[0], id: 43, status: "Accepted" }];
  completeCleanerJob.mockImplementation(async () => { jobs = [{ ...jobs[0], status: "Completed", completedAt }, jobs[1]]; });
  await act(async () => root.render(<CleanerJobs />));
  expect(button("Bắt đầu công việc").disabled).toBe(true);
  expect(container.textContent).toContain("Hoàn thành ca đang làm trước khi bắt đầu ca này.");
  await act(async () => button("Bắt đầu công việc").click());
  expect(startCleanerJob).not.toHaveBeenCalled();
  await act(async () => button("Hoàn thành công việc").click());
  expect(completeCleanerJob).toHaveBeenCalledWith(42);
  expect(button("Bắt đầu công việc").disabled).toBe(false);
});

test("a stale claim displays the schedule conflict and removes the unavailable job on reload", async () => {
  jobs = [];
  const candidate = { id: 44, status: "Pending", startTime: startedAt, durationHours: 2, price: 140000 };
  getAvailableCleanerJobs.mockResolvedValueOnce([candidate]).mockResolvedValue([]);
  acceptCleanerJob.mockImplementation(async () => {
    jobs = [{ ...candidate, id: 45, status: "Accepted" }];
    throw { response: { status: 409, data: { message: "Ca này trùng lịch với ca bạn đã nhận." } } };
  });
  await act(async () => root.render(<CleanerJobs />));
  await act(async () => button("Nhan viec").click());
  expect(acceptCleanerJob).toHaveBeenCalledWith(44);
  expect(container.textContent).toContain("Ca này trùng lịch với ca bạn đã nhận.");
  expect(container.textContent).not.toContain("Nhan viec thanh cong.");
  expect(container.querySelector('article[data-booking-id="44"]')).toBeNull();
  expect(container.querySelector('article[data-booking-id="45"]')).not.toBeNull();
});

test("cash collection requires confirmation and only server success shows paid", async () => {
  jobs = [{ ...jobs[0], status: "Completed", paymentMethod: "cash", paymentStatus: "Unpaid" }];
  const confirmation = jest.spyOn(window, "confirm").mockReturnValue(false);
  try {
    await act(async () => root.render(<CleanerJobs />));
    await act(async () => button("Xác nhận đã nhận tiền mặt").click());
    expect(confirmCashPayment).not.toHaveBeenCalled();
    confirmation.mockReturnValue(true);
    confirmCashPayment.mockRejectedValueOnce({ response: { data: { message: "Không thể ghi nhận." } } });
    await act(async () => button("Xác nhận đã nhận tiền mặt").click());
    expect(container.textContent).toContain("Chưa có xác nhận nhận tiền mặt");
    expect(container.textContent).toContain("Không thể ghi nhận.");
    confirmCashPayment.mockImplementation(async () => {
      jobs = [{ ...jobs[0], paymentStatus: "Paid", paidAt: completedAt }];
    });
    await act(async () => button("Xác nhận đã nhận tiền mặt").click());
    expect(confirmCashPayment).toHaveBeenCalledWith(42);
    expect(container.textContent).toContain("Cleaner xác nhận đã nhận tiền mặt");
    expect(container.textContent).toContain("Thời gian xác nhận:");
    expect(button("Xác nhận đã nhận tiền mặt")).toBeUndefined();
  } finally { confirmation.mockRestore(); }
});

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
