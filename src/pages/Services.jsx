import { Ui, Raw } from './../ui/Preferences';
import { useEffect, useState } from "react";
import { Link } from './../ui/Links';
import { getServices } from "../api/services";
const icons = { cleaning: "🧽", cooking: "👩‍🍳", laundry: "👕", childcare: "👶" };
export default function Services() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = () => { setError(""); getServices().then(setItems).catch(() => setError("Không thể tải dịch vụ. Vui lòng thử lại.")); };
  useEffect(() => { load(); }, []);
  return <Ui as="main" className="mx-auto max-w-6xl px-4 py-12">
    <Ui as="h1" className="text-3xl font-bold">Dịch vụ CleanMate</Ui>
    <Ui as="p" className="my-4 text-slate-600">Giá hiện tại theo giờ. Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca.</Ui>
    {error && <Ui as="div" role="alert"><Ui as="p">{error}</Ui><Ui as="button" onClick={load}>Thử lại</Ui></Ui>}
    {!items && !error && <Ui as="p">Đang tải dịch vụ...</Ui>}
    {items?.length === 0 && <Ui as="p">Hiện chưa có dịch vụ mở đặt lịch.</Ui>}
    <Ui as="div" className="mt-8 grid gap-6 sm:grid-cols-2">
      {items?.map(item => <Ui as="article" key={item.key} className="rounded-2xl border bg-white p-6 shadow-sm">
        <Ui as="span" className="text-4xl" aria-hidden="true">{icons[item.key] || "✨"}</Ui>
        <Ui as="h2" className="my-3 text-xl font-semibold">{<Raw>{item.name}</Raw>}</Ui>
        <Ui as="p" className="mb-2 font-bold text-emerald-700">{item.hourlyRate.toLocaleString("vi-VN")} đ/giờ</Ui>
        <Ui as="p" className="mb-6 text-slate-600">Thời lượng: {item.minHours}–{item.maxHours} giờ</Ui>
        <Link to="/booking" className="rounded-lg bg-emerald-700 px-4 py-2 text-white">Đặt lịch</Link>
      </Ui>)}
    </Ui>
  </Ui>;
}