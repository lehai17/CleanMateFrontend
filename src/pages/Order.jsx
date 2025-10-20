import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

export default function Order() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user?.id && !user?.userId) {
      setErr("Chưa xác định userId.");
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        setErr("");
        const uid = user?.id || user?.userId;

        // ✅ Gọi API bằng axios instance
        const res = await api.get(
          `/api/orders?userId=${encodeURIComponent(uid)}`
        );
        const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setOrders(normalizeOrders(list));
      } catch (e) {
        console.error("Fetch orders error:", e);
        setErr(e.message || "Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user?.id, user?.userId, token]);

  // ==== XÓA ====
  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa đơn này?")) return;
    try {
      await api.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // ==== SỬA ====
  async function handleEdit(order) {
    const newDate = window.prompt(
      "Nhập ngày bắt đầu (YYYY-MM-DD HH:mm):",
      order.date ? formatDateInput(order.date) : ""
    );
    if (newDate === null) return;

    const newPayment = window.prompt(
      "Nhập phương thức thanh toán (vd: cash, momo, vnpay):",
      order.paymentMethod || "cash"
    );
    if (newPayment === null) return;

    try {
      const res = await api.put(`/api/orders/${order.id}`, {
        ...order,
        startTime: new Date(newDate).toISOString(),
        paymentMethod: newPayment,
      });

      setOrders((prev) => prev.map((x) => (x.id === order.id ? res.data : x)));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng đã đặt</h1>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-gray-600">
            Đang tải đơn hàng…
          </div>
        )}

        {!loading && err && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm p-6">
            <p className="font-medium">Không thể tải dữ liệu</p>
            <p className="text-sm mt-1">{err}</p>
          </div>
        )}

        {!loading && !err && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-gray-600">
            Bạn chưa có đơn hàng nào.
          </div>
        )}

        {!loading && !err && orders.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Ngày bắt đầu</th>
                  <th className="px-6 py-3">Địa chỉ</th>
                  <th className="px-6 py-3">Giá</th>
                  <th className="px-6 py-3">Thanh toán</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {o.orderCode || o.id}
                    </td>
                    <td className="px-6 py-4">{formatDate(o.date)}</td>
                    <td className="px-6 py-4">{o.address || "-"}</td>
                    <td className="px-6 py-4">
                      {typeof o.price === "number"
                        ? `${o.price.toLocaleString()} đ`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{o.paymentMethod || "-"}</td>
                    <td className="px-6 py-4 space-x-3">
                      <button
                        onClick={() => handleEdit(o)}
                        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Xóa
                      </button>
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

/* ================= helpers ================= */

function normalizeOrders(list) {
  return list.map((b) => ({
    id: b.id ?? b.bookingId,
    orderCode: b.orderCode || (b.id ? "CM" + b.id : undefined),
    date: b.date ?? b.startTime ?? b.createdAt,
    price: b.price,
    address: b.address,
    paymentMethod: b.paymentMethod,
    createdAt: b.createdAt,
  }));
}

function formatDate(val) {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function formatDateInput(val) {
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return "";
  }
}
