// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Tạo link tới anchor trên trang chủ (/#services, /#how-it-works, /#contact)
  // Nếu đang ở trang khác, Link vẫn dẫn về "/" kèm hash, Landing sẽ tự scroll.
  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Dịch vụ", to: "/services" },
    { label: "Đặt lịch", to: "/booking", cta: true },
    { label: "Đơn hàng", to: "/orders" },
    { label: "Cách hoạt động", to: "/how-it-works" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-bold mb-4 mt-4"
          >
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-12 md:h-14 lg:h-16 w-auto mr-3 shrink-0"
            />
            <span
              style={{ fontFamily: '"Pacifico", cursive', lineHeight: 1 }}
              className="text-3xl md:text-4xl"
            >
              <span className="text-emerald-600">Clean</span>
              <span className="text-amber-500">Mate</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="font-medium text-gray-700">
                  👋 {user.fullName}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg px-4 py-2 text-white font-semibold shadow-sm
                         bg-emerald-600 hover:bg-emerald-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
