import { useEffect, useState } from "react";
import {
  acceptCleanerJob,
  getAvailableCleanerJobs,
  getMyCleanerJobs,
} from "../api/bookings";

export default function CleanerJobs() {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  const handleAccept = async (jobId) => {
    try {
      await acceptCleanerJob(jobId);
      setMessage("Nhan viec thanh cong.");
      await loadJobs();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Nhan viec that bai.");
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
                    onAction={() => handleAccept(job.id)}
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
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, actionLabel, onAction }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
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
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
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
