import { useEffect, useState } from "react";
import {
  acceptCleanerJob,
  getAvailableCleanerJobs,
  getMyCleanerJobs,
  startCleanerJob,
  completeCleanerJob,
} from "../api/bookings";

export default function CleanerJobs() {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyJobId, setBusyJobId] = useState(null);

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
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Khu vuc cleaner</h1>
            <p className="mt-2 text-slate-600">
              Xem don moi va nhan viec ngay khi co khach dat lich.
            </p>
          </div>
          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">Dang tai danh sach viec...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Don dang cho nhan</h2>
              <div className="mt-6 space-y-4">
                {availableJobs.length === 0 && (
                  <p className="text-sm text-slate-500">Hien chua co don moi.</p>
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
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Don cua toi</h2>
              <div className="mt-6 space-y-4">
                {myJobs.length === 0 && (
                  <p className="text-sm text-slate-500">Ban chua nhan don nao.</p>
                )}
                {myJobs.map((job) => (
                  <JobCard key={job.id} job={job}
                    disabled={busyJobId !== null}
                    actionLabel={job.status === "Accepted" ? "Bắt đầu công việc" : "Hoàn thành công việc"}
                    onAction={job.status === "Accepted"
                      ? () => handleAction(job.id, startCleanerJob, "Đã bắt đầu công việc.")
                      : job.status === "InProgress"
                      ? () => handleAction(job.id, completeCleanerJob, "Đã hoàn thành công việc.")
                      : undefined} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, actionLabel, onAction, disabled }) {
  return (
    <article data-booking-id={job.id} className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">CM{job.id}</p>
          <h3 className="text-lg font-semibold text-slate-900">{job.customerName}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.customerPhone || "Chua co so dien thoai"}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {job.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>Thoi gian: {formatDate(job.startTime)}</p>
        <p>So gio: {job.durationHours || 0}</p>
        <p>Dia chi: {job.address || "-"}</p>
        <p>Thanh toan: {job.paymentMethod || "-"}</p>
        <p>Gia: {Number(job.price || 0).toLocaleString("vi-VN")} d</p>
        {job.notes && <p>Ghi chu: {job.notes}</p>}
        {job.startedAt && <p>Bắt đầu thực tế: {formatDate(job.startedAt)}</p>}
        {job.completedAt && <p>Hoàn thành thực tế: {formatDate(job.completedAt)}</p>}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          disabled={disabled}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
}
