import { Ui, useUiPreferences } from '../ui/Preferences';
import { Link } from '../ui/Links';

export default function NotFound() {
  const { language } = useUiPreferences(), en = language === 'en';
  return <Ui as="main" className="mx-auto max-w-xl px-6 py-16 text-center">
    <Ui as="p" className="text-5xl font-bold text-emerald-700">404</Ui>
    <Ui as="h1" className="mt-4 text-3xl font-bold text-gray-900">{en ? 'Page not found' : 'Không tìm thấy trang'}</Ui>
    <Ui as="p" className="my-6 text-gray-600">{en ? 'This page is unavailable. You can return home or browse services.' : 'Trang này không còn khả dụng. Bạn có thể về trang chủ hoặc xem các dịch vụ.'}</Ui>
    <Ui as="div" className="flex flex-wrap justify-center gap-4">
      <Link to="/" className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white">Trang chủ</Link>
      <Link to="/services" className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700">Dịch vụ</Link>
    </Ui>
  </Ui>;
}
