import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold">CleanMate</div>
            <p className="mb-4 text-gray-400">
              Dịch vụ giúp việc theo giờ chuyên nghiệp, rõ ràng và đáng tin cậy.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61581594251149"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white">Dọn dẹp nhà cửa</button></li>
              <li><button className="hover:text-white">Nấu ăn và rửa bát</button></li>
              <li><button className="hover:text-white">Giặt ủi</button></li>
              <li><button className="hover:text-white">Chăm sóc trẻ em</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/policies?tab=terms" className="hover:text-white">Điều khoản sử dụng</Link></li>
              <li><Link to="/policies?tab=privacy" className="hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link to="/policies?tab=refund" className="hover:text-white">Chính sách hoàn tiền</Link></li>
              <li><a href="#contact" className="hover:text-white">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <div>📞 1900 1234</div>
              <div>✉️ hello@cleanmate.vn</div>
              <div>📍 Mr. Nguyễn Xuân Hòa</div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 CleanMate. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
