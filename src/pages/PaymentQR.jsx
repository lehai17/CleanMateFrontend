import { Link } from "react-router-dom";

export default function PaymentQR() {
  return <main className="mx-auto max-w-xl px-4 py-16">
    <h1 className="text-2xl font-bold">Thanh toán tiền mặt trực tiếp</h1>
    <p className="my-4">Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca. CleanMate không thu hoặc giữ tiền.</p>
    <Link to="/orders" className="text-emerald-700 underline">Xem đơn hàng</Link>
  </main>;
}
