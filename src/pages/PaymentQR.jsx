import { Link } from "react-router-dom";

export default function PaymentQR() {
  return <main className="mx-auto max-w-xl px-4 py-16">
    <h1 className="text-2xl font-bold">Thanh toán online chưa được hỗ trợ</h1>
    <p className="my-4">Vui lòng chọn thanh toán tiền mặt khi đặt lịch.</p>
    <Link to="/booking" className="text-emerald-700 underline">Quay lại đặt lịch</Link>
  </main>;
}
