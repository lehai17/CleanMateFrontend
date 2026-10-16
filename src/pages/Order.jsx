import { useCallback, useEffect, useRef, useState } from "react";
import { confirmOrderCompletion, deleteOrder, getOrders, rescheduleOrder } from "../api/bookings";
import { paymentLabel } from "../utils/payment";
import { phoneLink } from "../utils/contact";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [feedbackError, setFeedbackError] = useState("");
  const [rescheduling, setRescheduling] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [message, setMessage] = useState("");
  const actionPending = useRef(false);

  const fetchOrders = useCallback(async () => {
      try {
        setLoading(true);
        setErr("");
        const list = await getOrders();
        setOrders(normalizeOrders(Array.isArray(list) ? list : []));
      } catch (error) {
        setErr(error?.message || "Khong the tai don hang.");
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleDelete(id) {
    if (actionPending.current) return;
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) {
      return;
    }

    actionPending.current = true;
    setBusyId(id);
    try {
      await deleteOrder(id);
      setOrders((current) => current.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item));
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể hủy đơn.");
    } finally { actionPending.current = false; setBusyId(null); }
  }

  async function submitReschedule(event) {
    event.preventDefault();
    if (actionPending.current || !rescheduling) return;
    const start = new Date(newTime);
    if (!newTime || Number.isNaN(start.getTime()) || start <= new Date()) {
      setFeedbackError("Vui lòng chọn ngày giờ trong tương lai.");
      return;
    }
    actionPending.current = true;
    setBusyId(rescheduling.id);
    setFeedbackError(""); setMessage("");
    try {
      const result = await rescheduleOrder(rescheduling.id, {
        startTime: start.toISOString(), expectedStartTime: rescheduling.date,
      });
      setOrders(current => current.map(order => order.id === rescheduling.id ? { ...order, ...result } : order));
      setRescheduling(null);
      setMessage("Đã đổi lịch thành công. Giá và thời lượng giữ nguyên.");
    } catch (error) {
      setFeedbackError(error?.response?.data?.message || "Không thể đổi lịch. Vui lòng thử lại.");
      if (error?.response?.status === 409) { setRescheduling(null); await fetchOrders(); }
    } finally { actionPending.current = false; setBusyId(null); }
  }

  async function submitFeedback(event, id) {
    event.preventDefault();
    if (actionPending.current) return;
    actionPending.current = true;
    setBusyId(id);
    setFeedbackError("");
    try {
      const result = await confirmOrderCompletion(id, { rating: Number(rating), review });
      setOrders(current => current.map(order => order.id === id ? { ...order, ...result } : order));
      setEditingId(null);
    } catch (error) {
      setFeedbackError(error?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally { actionPending.current = false; setBusyId(null); }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Don hang da dat</h1>
          <button onClick={fetchOrders} disabled={loading || busyId !== null}
            className="rounded border px-3 py-2 disabled:opacity-50">Tải lại trạng thái</button>
        </div>

        <p className="mb-6 rounded-xl bg-emerald-50 p-4 text-emerald-900">
          Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca. CleanMate chỉ kết nối dịch vụ, không thu hoặc giữ tiền.
        </p>
        {feedbackError && <p role="alert" className="mb-4 text-red-700">{feedbackError}</p>}
        {message && <p role="status" className="mb-4 text-emerald-800">{message}</p>}

        {loading && (
          <div className="rounded-xl bg-white p-8 shadow-sm text-gray-600">
            Dang tai don hang...
          </div>
        )}

        {!loading && err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="font-medium">Khong the tai du lieu</p>
            <p className="mt-1 text-sm">{err}</p>
          </div>
        )}

        {!loading && !err && orders.length === 0 && (
          <div className="rounded-xl bg-white p-8 shadow-sm text-gray-600">
            Ban chua co don hang nao.
          </div>
        )}

        {!loading && !err && orders.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3">Ma don</th>
                  <th className="px-6 py-3">Ngay bat dau</th>
                  <th className="px-6 py-3">Dia chi</th>
                  <th className="px-6 py-3">Cleaner nhận việc</th>
                  <th className="px-6 py-3">Gia</th>
                  <th className="px-6 py-3">Thanh toan</th>
                  <th className="px-6 py-3">Trang thai</th>
                  <th className="px-6 py-3">Hanh dong</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {order.orderCode}
                    </td>
                    <td className="px-6 py-4">{formatDate(order.date)}</td>
                    <td className="px-6 py-4">
                      <p>{order.address || "-"}</p>
                      {order.contactName && <p>Người liên hệ: {order.contactName}</p>}
                      {order.contactPhone && <p>SĐT liên hệ: {order.contactPhone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {order.cleaner ? <>
                        <p>{order.cleaner.name}</p>
                        <p>{order.cleaner.phoneNumber || "Chưa cập nhật số điện thoại"}</p>
                        {phoneLink(order.cleaner.phoneNumber) &&
                          <a className="text-emerald-700 underline" href={phoneLink(order.cleaner.phoneNumber)}>Gọi cleaner</a>}
                      </> : <p>Chưa có cleaner nhận việc</p>}
                    </td>
                    <td className="px-6 py-4">
                      {typeof order.price === "number"
                        ? `${order.price.toLocaleString("vi-VN")} d`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <p>{order.paymentMethod === "cash" ? "Tiền mặt trực tiếp" : "Ghi nhận cũ"}</p>
                      <p>{paymentLabel(order.paymentStatus, order.paymentMethod)}</p>
                      {order.paidAt && <p className="text-xs text-gray-500">Thời gian xác nhận: {formatDate(order.paidAt)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p>{order.status || "-"}</p>
                      {order.startedAt && <p className="text-xs text-gray-500">Bắt đầu: {formatDate(order.startedAt)}</p>}
                      {order.completedAt && <p className="text-xs text-gray-500">Hoàn thành: {formatDate(order.completedAt)}</p>}
                      {order.customerConfirmedAt && <div className="mt-2 text-sm">
                        <p>Khách đã xác nhận hoàn thành</p>
                        <p>Đánh giá: {order.customerRating}/5 sao</p>
                        {order.customerReview && <p>{order.customerReview}</p>}
                      </div>}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled={busyId !== null || order.status !== "Pending" || new Date(order.date) <= new Date()}
                        onClick={() => handleDelete(order.id)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Hủy đơn
                      </button>
                      {order.status === "Pending" && !order.cleaner && new Date(order.date) > new Date() &&
                        (rescheduling?.id === order.id ? <form onSubmit={submitReschedule} className="mt-3 space-y-2">
                          <p>Chỉ đổi ngày/giờ khi chưa có cleaner nhận. Giá và thời lượng giữ nguyên.</p>
                          <label htmlFor={`schedule-${order.id}`} className="block">Ngày giờ mới</label>
                          <input id={`schedule-${order.id}`} type="datetime-local" required value={newTime}
                            min={localInputTime(new Date(Date.now() + 60000))} disabled={busyId !== null}
                            onChange={event => setNewTime(event.target.value)} className="block rounded border p-2" />
                          <button type="submit" disabled={busyId !== null || !newTime} className="rounded bg-emerald-700 px-3 py-2 text-white">Lưu lịch mới</button>
                          <button type="button" disabled={busyId !== null} onClick={() => setRescheduling(null)} className="ml-2 rounded border px-3 py-2">Đóng</button>
                        </form> : <button disabled={busyId !== null} onClick={() => {
                          setRescheduling(order); setNewTime(localInputTime(order.date));
                          setFeedbackError(""); setMessage(""); setEditingId(null);
                        }} className="mt-2 block rounded border px-3 py-2">Đổi lịch</button>)}
                      {order.status === "Completed" && !order.customerConfirmedAt && (editingId === order.id ? (
                        <form onSubmit={event => submitFeedback(event, order.id)} className="mt-3 space-y-2">
                          <p>Xác nhận công việc đã hoàn thành. Đánh giá này không xác nhận đã trả tiền.</p>
                          <label htmlFor={`rating-${order.id}`} className="block">Đánh giá ca làm</label>
                          <select id={`rating-${order.id}`} required value={rating} disabled={busyId !== null}
                            onChange={event => setRating(event.target.value)} className="rounded border p-2">
                            <option value="">Chọn số sao</option>
                            {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} sao</option>)}
                          </select>
                          <label htmlFor={`review-${order.id}`} className="block">Nhận xét (không bắt buộc)</label>
                          <textarea id={`review-${order.id}`} maxLength={1000} value={review} disabled={busyId !== null}
                            onChange={event => setReview(event.target.value)} className="block rounded border p-2" />
                          <button type="submit" disabled={busyId !== null || !rating} className="rounded bg-emerald-700 px-3 py-2 text-white">Gửi đánh giá</button>
                          <button type="button" disabled={busyId !== null} onClick={() => setEditingId(null)} className="ml-2 rounded border px-3 py-2">Đóng</button>
                        </form>
                      ) : <button disabled={busyId !== null} onClick={() => {
                        setEditingId(order.id); setRating(""); setReview(""); setFeedbackError("");
                        setRescheduling(null);
                      }} className="mt-2 block rounded bg-emerald-700 px-3 py-2 text-white">Xác nhận và đánh giá</button>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function normalizeOrders(list) {
  return list.map((booking) => ({
    id: booking.id ?? booking.bookingId,
    orderCode: booking.orderCode || `CM${booking.id}`,
    date: booking.date ?? booking.startTime ?? booking.createdAt,
    price: booking.price,
    address: booking.address,
    contactName: booking.contactName,
    contactPhone: booking.contactPhone,
    cleaner: booking.cleaner,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    paidAt: booking.paidAt,
    createdAt: booking.createdAt,
    status: booking.status,
    startedAt: booking.startedAt,
    completedAt: booking.completedAt,
    customerConfirmedAt: booking.customerConfirmedAt,
    customerRating: booking.customerRating,
    customerReview: booking.customerReview,
  }));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("vi-VN");
}

function localInputTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
