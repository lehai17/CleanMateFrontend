import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../api/services";
const icons = { cleaning: "🧽", cooking: "👩‍🍳", laundry: "👕", childcare: "👶" };
export default function Services() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = () => { setError(""); getServices().then(setItems).catch(() => setError("Không thể tải dịch vụ. Vui lòng thử lại.")); };
  useEffect(() => { load(); }, []);
  return <main className="mx-auto max-w-6xl px-4 py-12">
    <h1 className="text-3xl font-bold">Dịch vụ CleanMate</h1>
    <p className="my-4 text-slate-600">Giá hiện tại theo giờ. Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca.</p>
    {error && <div role="alert"><p>{error}</p><button onClick={load}>Thử lại</button></div>}
    {!items && !error && <p>Đang tải dịch vụ...</p>}
    {items?.length === 0 && <p>Hiện chưa có dịch vụ mở đặt lịch.</p>}
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {items?.map(item => <article key={item.key} className="rounded-2xl border bg-white p-6 shadow-sm">
        <span className="text-4xl" aria-hidden="true">{icons[item.key] || "✨"}</span>
        <h2 className="my-3 text-xl font-semibold">{item.name}</h2>
        <p className="mb-2 font-bold text-emerald-700">{item.hourlyRate.toLocaleString("vi-VN")} đ/giờ</p>
        <p className="mb-6 text-slate-600">Thời lượng: {item.minHours}–{item.maxHours} giờ</p>
        <Link to="/booking" className="rounded-lg bg-emerald-700 px-4 py-2 text-white">Đặt lịch</Link>
      </article>)}
    </div>
  </main>;
}