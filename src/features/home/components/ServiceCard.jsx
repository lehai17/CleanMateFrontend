import { Ui } from './../../../ui/Preferences';
export default function ServiceCard({ icon, title, description, onBook }) {
  return (
    <Ui as="article" className="rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-white/40 backdrop-blur">
      <Ui as="div" className="mb-4 text-4xl" aria-hidden>
        {icon}
      </Ui>
      <Ui as="h3" className="mb-3 text-2xl font-bold text-gray-900">{title}</Ui>
      <Ui as="p" className="mb-4 text-gray-600">{description}</Ui>
      <Ui as="div" className="mb-5 text-lg font-bold text-emerald-700">Xem giá hiện tại khi đặt lịch</Ui>
      <Ui as="button"
        onClick={onBook}
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-amber-500 px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        Đặt lịch ngay
      </Ui>
    </Ui>
  );
}
