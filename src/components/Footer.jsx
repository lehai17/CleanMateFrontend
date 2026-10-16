import { Ui } from './../ui/Preferences';
import { Link } from './../ui/Links';
import { FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <Ui as="footer" id="contact" className="bg-gray-900 py-16 text-white">
      <Ui as="div" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Ui as="div" className="grid gap-8 md:grid-cols-4">
          <Ui as="div">
            <Ui as="div" className="mb-4 text-2xl font-bold">CleanMate</Ui>
            <Ui as="p" className="mb-4 text-gray-400">
              Dịch vụ giúp việc theo giờ chuyên nghiệp, rõ ràng và đáng tin cậy.
            </Ui>
            <Ui as="a"
              href="https://www.facebook.com/profile.php?id=61581594251149"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FaFacebookF className="h-4 w-4" />
            </Ui>
          </Ui>

          <Ui as="div">
            <Ui as="h3" className="mb-4 font-semibold">Dịch vụ</Ui>
            <Ui as="ul" className="space-y-2 text-gray-400">
              <Ui as="li"><Ui as="button" className="hover:text-white">Dọn dẹp nhà cửa</Ui></Ui>
              <Ui as="li"><Ui as="button" className="hover:text-white">Nấu ăn và rửa bát</Ui></Ui>
              <Ui as="li"><Ui as="button" className="hover:text-white">Giặt ủi</Ui></Ui>
              <Ui as="li"><Ui as="button" className="hover:text-white">Chăm sóc trẻ em</Ui></Ui>
            </Ui>
          </Ui>

          <Ui as="div">
            <Ui as="h3" className="mb-4 font-semibold">Hỗ trợ</Ui>
            <Ui as="ul" className="space-y-2 text-gray-400">
              <Ui as="li"><Link to="/policies?tab=terms" className="hover:text-white">Điều khoản sử dụng</Link></Ui>
              <Ui as="li"><Link to="/policies?tab=privacy" className="hover:text-white">Chính sách bảo mật</Link></Ui>
              <Ui as="li"><Link to="/policies?tab=refund" className="hover:text-white">Chính sách hoàn tiền</Link></Ui>
              <Ui as="li"><Ui as="a" href="#contact" className="hover:text-white">Liên hệ</Ui></Ui>
            </Ui>
          </Ui>

          <Ui as="div">
            <Ui as="h3" className="mb-4 font-semibold">Liên hệ</Ui>
            <Ui as="div" className="space-y-2 text-gray-400">
              <Ui as="div">📞 1900 1234</Ui>
              <Ui as="div">✉️ hello@cleanmate.vn</Ui>
              <Ui as="div">📍 Mr. Nguyễn Xuân Hòa</Ui>
            </Ui>
          </Ui>
        </Ui>

        <Ui as="div" className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <Ui as="p">© 2025 CleanMate. Tất cả quyền được bảo lưu.</Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}
