import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // Logout can make PrivateRoute replace navigation state before this page mounts.
  const [passwordChanged] = useState(()=>sessionStorage.getItem('cm_password_changed')==='1');
  const [sessionsRevoked] = useState(()=>sessionStorage.getItem('cm_sessions_revoked')==='1');
  useEffect(()=>{sessionStorage.removeItem('cm_password_changed');sessionStorage.removeItem('cm_sessions_revoked');},[]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login(res.user, res.token);
      const from = location.state?.from?.pathname || "/";
      const isAdmin = ["Admin", "Staff"].includes(String(res.user?.role));
      const isCleaner =
        String(res.user?.role) === "Cleaner" || Boolean(res.user?.isCleaner);
      navigate(isAdmin ? "/admin" : isCleaner ? "/cleaner/jobs" : from, {
        replace: true,
      });
    } catch (err) {
      setPassword('');
      const data=err?.response?.data;
      setError(data?.message || (typeof data==='string' && data) || 'Sai email hoặc mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-emerald-600 to-amber-500 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-end justify-center gap-2">
            <img src="/images/logo.png" alt="CleanMate" className="h-10 w-auto" />
            <span className="text-3xl" style={{ fontFamily: '"Pacifico", cursive' }}>
              <span className="text-emerald-600">Clean</span>
              <span className="text-amber-500">Mate</span>
            </span>
          </Link>
          <p className="mt-2 text-gray-600">Dịch vụ giúp việc theo giờ</p>
        </div>

        {(passwordChanged || location.state?.passwordChanged) && <p role="status" className="mb-4 text-emerald-800">Đã đổi mật khẩu. Vui lòng đăng nhập lại.</p>}
        {(sessionsRevoked || location.state?.sessionsRevoked) && <p role="status" className="mb-4 text-emerald-800">Đã đăng xuất tất cả thiết bị. Vui lòng đăng nhập lại.</p>}
        <form onSubmit={onSubmit} className="space-y-6">
          {error && <p role="alert" className="text-red-700">{error}</p>}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              maxLength={254}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                maxLength={128}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Tính năng quên mật khẩu đang được cập nhật.")}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-amber-500 px-4 py-3 font-semibold text-white transition-all hover:from-emerald-500 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
