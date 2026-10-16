import { Ui } from './../ui/Preferences';
export default function AdminDashboard() {
  const url = process.env.REACT_APP_ADMIN_URL || "http://127.0.0.1:3001";
  return <Ui as="main" className="mx-auto max-w-xl p-8">
    <Ui as="h1" className="text-2xl font-bold">CleanMate Quản trị</Ui>
    <Ui as="p" className="my-4">Khu vực Admin/Staff đã được tách thành ứng dụng quản trị riêng.</Ui>
    <Ui as="a" href={url} className="rounded bg-emerald-700 px-4 py-3 text-white">Mở trang quản trị</Ui>
  </Ui>;
}