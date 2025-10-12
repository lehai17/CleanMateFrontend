// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const contentTopRef = useRef(null);
  const [active, setActive] = useState("terms");
  const setTab = (id) => {
    setActive(id);
    // scroll lên đầu vùng nội dung
    contentTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">CleanMate</div>
            <p className="text-gray-400 mb-4">
              Dịch vụ giúp việc theo giờ chuyên nghiệp và đáng tin cậy.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 text-white"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/yourpage"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600 text-white"
              >
                <FaInstagram className="w-4 h-4" />
              </a>

              <a
                href="mailto:hello@cleanmate.vn"
                aria-label="Gmail"
                className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-800 text-white"
              >
                <SiGmail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button className="hover:text-white">Dọn dẹp nhà cửa</button>
              </li>
              <li>
                <button className="hover:text-white">Nấu ăn, rửa bát</button>
              </li>
              <li>
                <button className="hover:text-white">Giặt ủi</button>
              </li>
              <li>
                <button className="hover:text-white">Chăm sóc trẻ em</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/policies?tab=terms" className="hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=privacy" className="hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=refund" className="hover:text-white">
                  Chính sách hoàn tiền
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <div>📞 1900 1234</div>
              <div>✉️ hello@cleanmate.vn</div>
              <div>📍 Mr. Nguyễn Xuân Hòa</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 CleanMate. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
