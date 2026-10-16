import { Ui } from './../ui/Preferences';
import { Link } from './../ui/Links';

export default function PaymentQR() {
  return <Ui as="main" className="mx-auto max-w-xl px-4 py-16">
    <Ui as="h1" className="text-2xl font-bold">Thanh toán tiền mặt trực tiếp</Ui>
    <Ui as="p" className="my-4">Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca. CleanMate không thu hoặc giữ tiền.</Ui>
    <Link to="/orders" className="text-emerald-700 underline">Xem đơn hàng</Link>
  </Ui>;
}
