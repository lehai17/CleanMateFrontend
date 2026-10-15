import { useEffect, useState } from "react";
import { deleteOrder, getOrders } from "../api/bookings";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchOrders() {
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
    }

    fetchOrders();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) {
      return;
    }

    try {
      await deleteOrder(id);
      setOrders((current) => current.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item));
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể hủy đơn.");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Don hang da dat</h1>
        </div>

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
                    <td className="px-6 py-4">{order.address || "-"}</td>
                    <td className="px-6 py-4">
                      {typeof order.price === "number"
                        ? `${order.price.toLocaleString("vi-VN")} d`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <p>{order.paymentMethod || "-"}</p>
                      <p>{order.paymentStatus === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                      {order.paidAt && <p className="text-xs text-gray-500">Thu tiền: {formatDate(order.paidAt)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p>{order.status || "-"}</p>
                      {order.startedAt && <p className="text-xs text-gray-500">Bắt đầu: {formatDate(order.startedAt)}</p>}
                      {order.completedAt && <p className="text-xs text-gray-500">Hoàn thành: {formatDate(order.completedAt)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled={order.status !== "Pending" || new Date(order.date) <= new Date()}
                        onClick={() => handleDelete(order.id)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Hủy đơn
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

function normalizeOrders(list) {
  return list.map((booking) => ({
    id: booking.id ?? booking.bookingId,
    orderCode: booking.orderCode || `CM${booking.id}`,
    date: booking.date ?? booking.startTime ?? booking.createdAt,
    price: booking.price,
    address: booking.address,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    paidAt: booking.paidAt,
    createdAt: booking.createdAt,
    status: booking.status,
    startedAt: booking.startedAt,
    completedAt: booking.completedAt,
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
