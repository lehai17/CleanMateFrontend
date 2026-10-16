import { Ui, Raw } from './../ui/Preferences';
import { Link } from './../ui/Links';
import { useAuth } from "../context/AuthContext";
import NotificationLink from "./NotificationLink";

export default function Header() {
  const { user, logout } = useAuth();
  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Dịch vụ", to: "/services" },
    { label: "Đặt lịch", to: "/booking" },
    { label: "Đơn hàng", to: "/orders" },
    { label: "Hồ sơ", to: "/profile" },
    { label: "Hỗ trợ", to: "/support" },
  ];

  return (
    <Ui as="header" className="sticky top-0 z-50 bg-white shadow-sm">
      <Ui as="div" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Ui as="img" src="/images/logo.png" alt="CleanMate" className="h-12 w-auto" />
          <Ui as="span" className="text-3xl font-bold">
            <Ui as="span" className="text-emerald-600">Clean</Ui>
            <Ui as="span" className="text-amber-500">Mate</Ui>
          </Ui>
        </Link>

        <Ui as="nav" className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-medium text-gray-700 hover:text-emerald-600"
            >
              {item.label}
            </Link>
          ))}
          {user?.isCleaner && (
            <Link
              to="/cleaner/jobs"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              Khu vực cộng tác viên
            </Link>
          )}
        </Ui>

        <Ui as="div" className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationLink />
              <Ui as="span" className="hidden font-medium text-gray-700 sm:inline">
                {<Raw>{user.fullName}</Raw>}
              </Ui>
              <Ui as="button"
                onClick={logout}
                className="rounded-lg bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300"
              >
                Đăng xuất
              </Ui>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </Ui>
      </Ui>
    </Ui>
  );
}
