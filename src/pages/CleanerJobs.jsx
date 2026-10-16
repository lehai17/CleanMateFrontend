import { Ui, Raw, t } from './../ui/Preferences';
import { useEffect, useState } from "react";
import { paymentLabel } from "../utils/payment";
import {
  acceptCleanerJob,
  getAvailableCleanerJobs,
  getMyCleanerJobs,
  startCleanerJob,
  completeCleanerJob,
  confirmCashPayment,
} from "../api/bookings";

export default function CleanerJobs() {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyJobId, setBusyJobId] = useState(null);
  const hasActiveJob = myJobs.some(job => job.status === "InProgress");

  const loadJobs = async () => {
    setLoading(true);
    try {
      const [available, mine] = await Promise.all([
        getAvailableCleanerJobs(),
        getMyCleanerJobs(),
      ]);
      setAvailableJobs(available);
      setMyJobs(mine);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Khong tai duoc danh sach viec.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleAction = async (jobId, action, successMessage) => {
    if (busyJobId !== null) return;
    setBusyJobId(jobId);
    try {
      await action(jobId);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Không thể cập nhật công việc. Vui lòng thử lại.");
    } finally {
      await loadJobs();
      setBusyJobId(null);
    }
  };

  return (
    <Ui as="div" className="bg-slate-50 min-h-screen py-10">
      <Ui as="div" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Ui as="div" className="mb-8 flex items-end justify-between gap-4">
          <Ui as="div">
            <Ui as="h1" className="text-3xl font-bold text-slate-900">Khu vuc cleaner</Ui>
            <Ui as="p" className="mt-2 text-slate-600">
              Xem don moi va nhan viec ngay khi co khach dat lich.
            </Ui>
            <Ui as="p" className="mt-2 text-slate-600">Khách trả tiền mặt trực tiếp sau ca. Chỉ xác nhận nhận tiền khi bạn đã nhận đủ từ khách.</Ui>
            <Ui as="p" className="mt-2 text-slate-600">Ca trùng lịch đã nhận sẽ được ẩn. Hoàn thành ca đang làm trước khi bắt đầu ca tiếp theo.</Ui>
          </Ui>
          {message && (
            <Ui as="div" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {message}
            </Ui>
          )}
        </Ui>

        {loading ? (
          <Ui as="div" className="rounded-2xl bg-white p-8 shadow-sm">Dang tai danh sach viec...</Ui>
        ) : (
          <Ui as="div" className="grid gap-8 lg:grid-cols-2">
            <Ui as="section" className="rounded-2xl bg-white p-6 shadow-sm">
              <Ui as="h2" className="text-xl font-semibold text-slate-900">Don dang cho nhan</Ui>
              <Ui as="div" className="mt-6 space-y-4">
                {availableJobs.length === 0 && (
                  <Ui as="p" className="text-sm text-slate-500">Hien chua co don moi.</Ui>
                )}
                {availableJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    actionLabel="Nhan viec"
                    disabled={busyJobId !== null}
                    onAction={() => handleAction(job.id, acceptCleanerJob, "Nhan viec thanh cong.")}
                  />
                ))}
              </Ui>
            </Ui>

            <Ui as="section" className="rounded-2xl bg-white p-6 shadow-sm">
              <Ui as="h2" className="text-xl font-semibold text-slate-900">Don cua toi</Ui>
              <Ui as="div" className="mt-6 space-y-4">
                {myJobs.length === 0 && (
                  <Ui as="p" className="text-sm text-slate-500">Ban chua nhan don nao.</Ui>
                )}
                {myJobs.map((job) => (
                  <JobCard key={job.id} job={job}
                    disabled={busyJobId !== null || (job.status === "Accepted" && hasActiveJob)}
                    blockedReason={job.status === "Accepted" && hasActiveJob
                      ? "Hoàn thành ca đang làm trước khi bắt đầu ca này." : ""}
                    actionLabel={job.status === "Completed" ? "Xác nhận đã nhận tiền mặt" : job.status === "Accepted" ? "Bắt đầu công việc" : "Hoàn thành công việc"}
                    onAction={job.status === "Accepted"
                      ? () => handleAction(job.id, startCleanerJob, "Đã bắt đầu công việc.")
                      : job.status === "InProgress"
                      ? () => handleAction(job.id, completeCleanerJob, "Đã hoàn thành công việc.")
                      : job.status === "Completed" && job.paymentStatus !== "Paid" && job.paymentMethod === "cash"
                      ? () => {
                        if (window.confirm(t(`Đã nhận đủ ${Number(job.price).toLocaleString("vi-VN")} đ tiền mặt cho CM${job.id}?`)))
                          handleAction(job.id, confirmCashPayment, "Đã lưu xác nhận nhận tiền mặt của bạn.");
                      }
                      : undefined} />
                ))}
              </Ui>
            </Ui>
          </Ui>
        )}
      </Ui>
    </Ui>
  );
}

function JobCard({ job, actionLabel, onAction, disabled, blockedReason }) {
  return (
    <Ui as="article" data-booking-id={job.id} className="rounded-2xl border border-slate-200 p-5">
      <Ui as="div" className="flex items-start justify-between gap-4">
        <Ui as="div">
          <Ui as="p" className="text-sm font-semibold text-emerald-700">CM{job.id}</Ui>
          <Ui as="h3" className="text-lg font-semibold text-slate-900">{<Raw>{job.customerName}</Raw>}</Ui>
          <Ui as="p" className="mt-1 text-sm text-slate-600">{job.customerPhone || "Chua co so dien thoai"}</Ui>
        </Ui>
        <Ui as="span" className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {job.status}
        </Ui>
      </Ui>

      <Ui as="div" className="mt-4 space-y-2 text-sm text-slate-700">
        <Ui as="p">Lịch dự kiến: {formatDate(job.startTime)} → {formatDate(new Date(new Date(job.startTime).getTime() + job.durationHours * 3600000))}</Ui>
        <Ui as="p">So gio: {job.durationHours || 0}</Ui>
        <Ui as="p">Dia chi: {<Raw>{job.address || "-"}</Raw>}</Ui>
        <Ui as="p">Thanh toán: {job.paymentMethod === "cash" ? "Tiền mặt trực tiếp" : "Ghi nhận cũ"}</Ui>
        <Ui as="p">{paymentLabel(job.paymentStatus, job.paymentMethod)}</Ui>
        {job.paidAt && <Ui as="p">Thời gian xác nhận: {formatDate(job.paidAt)}</Ui>}
        {job.customerConfirmedAt && <Ui as="p">Khách đã xác nhận hoàn thành · Đánh giá: {job.customerRating}/5 sao</Ui>}
        <Ui as="p">Gia: {Number(job.price || 0).toLocaleString("vi-VN")} d</Ui>
        {job.notes && <Ui as="p">Ghi chu: {<Raw>{job.notes}</Raw>}</Ui>}
        {job.startedAt && <Ui as="p">Bắt đầu thực tế: {formatDate(job.startedAt)}</Ui>}
        {job.completedAt && <Ui as="p">Hoàn thành thực tế: {formatDate(job.completedAt)}</Ui>}
      </Ui>

      {blockedReason && <Ui as="p" className="mt-3 text-sm text-amber-800">{blockedReason}</Ui>}

      {onAction && (
        <Ui as="button"
          onClick={onAction}
          disabled={disabled}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {actionLabel}
        </Ui>
      )}
    </Ui>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "-";
  }

  return date.toLocaleString("vi-VN");
}
