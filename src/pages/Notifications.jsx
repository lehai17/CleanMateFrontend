import { Ui, Raw } from './../ui/Preferences';
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from './../ui/Links';
import { getNotifications, readNotification, readAllNotifications } from "../api/notifications";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const { refresh } = useNotifications();
  const load = useCallback(async beforeId => {
    if (pending.current) return;
    pending.current = true; setLoading(true); setError("");
    try {
      const data = await getNotifications(beforeId);
      setItems(current => beforeId ? [...current, ...data.items.filter(item => !current.some(old => old.id === item.id))] : data.items);
      setUnreadCount(data.unreadCount); setCursor(data.nextBeforeId);
    } catch { setError("Không thể tải thông báo. Vui lòng thử lại."); }
    finally { pending.current = false; setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const markRead = async item => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      const result = item ? await readNotification(item.id) : await readAllNotifications(items[0].id);
      setItems(current => current.map(n => !n.readAt && (!item || n.id === item.id) ? { ...n, readAt: result.readAt } : n));
      setUnreadCount(result.unreadCount); refresh();
    } catch { setError("Không thể đánh dấu đã đọc. Vui lòng thử lại."); }
    finally { pending.current = false; setBusy(false); }
  };

  return <Ui as="main" className="mx-auto max-w-3xl px-4 py-8">
    <Ui as="h1" className="text-2xl font-bold">Thông báo</Ui>
    <Ui as="p" className="mt-2 text-slate-600">Cập nhật về đơn hàng và ca làm của bạn.</Ui>
    {unreadCount !== null && <Ui as="p" className="mt-2">Chưa đọc: {unreadCount}</Ui>}
    <Ui as="div" className="my-4 flex flex-wrap gap-3">
      <Ui as="button" disabled={loading || busy} onClick={() => { load(); refresh(); }} className="rounded border px-3 py-2">Tải lại thông báo</Ui>
      <Ui as="button" disabled={loading || busy || !items.length || !unreadCount} onClick={() => markRead(null)} className="rounded bg-emerald-700 px-3 py-2 text-white disabled:opacity-50">Đánh dấu tất cả đã đọc</Ui>
    </Ui>
    {error && <Ui as="p" role="alert" className="my-3 text-red-700">{error}</Ui>}
    {loading && <Ui as="p" role="status">Đang tải thông báo...</Ui>}
    {!loading && !error && items.length === 0 && <Ui as="p">Bạn chưa có thông báo.</Ui>}
    <Ui as="div" className="space-y-3">
      {items.map(item => <Ui as="article" key={item.id} data-notification-id={item.id}
        className={`rounded-xl border p-4 ${item.readAt ? "bg-white" : "border-emerald-300 bg-emerald-50"}`}>
        <Ui as="h2" className="font-semibold">{item.title}</Ui>
        <Ui as="p" className="my-2">{<Raw>{item.message}</Raw>}</Ui>
        <Ui as="p" className="text-sm text-slate-600">{new Date(item.createdAt).toLocaleString("vi-VN")} · {item.readAt ? "Đã đọc" : "Chưa đọc"}</Ui>
        <Ui as="div" className="mt-3 flex flex-wrap gap-4">
          <Link to={item.target === "Support" ? "/support" : item.target === "Profile" ? "/profile" : item.target === "CleanerJobs" ? "/cleaner/jobs" : "/orders"} className="text-emerald-800 underline">{item.target === "Support" ? "Xem hỗ trợ" : item.target === "Profile" ? "Xem hồ sơ" : `Xem đơn CM${item.bookingId}`}</Link>
          {!item.readAt && <Ui as="button" disabled={busy || loading} onClick={() => markRead(item)} className="text-emerald-800 underline">Đánh dấu đã đọc</Ui>}
        </Ui>
      </Ui>)}
    </Ui>
    {cursor && <Ui as="button" disabled={loading || busy} onClick={() => load(cursor)} className="mt-4 rounded border px-4 py-2">Xem thêm</Ui>}
  </Ui>;
}
