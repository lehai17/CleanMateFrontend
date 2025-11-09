// src/pages/Login.jsx
import { useState, useRef } from "react";
// [SỬA] thêm useLocation để lấy trang gốc (from) khi bị chặn
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/axios";

export default function Login() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  // [SỬA] lấy location để đọc state.from (trang trước đó khi bị chặn)
  const loc = useLocation();

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      alert("Vui lòng chọn file PNG!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result);
    reader.readAsDataURL(file);
  };

  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gọi API để đăng nhập
      const res = await loginApi(email, password);
      console.log("Login successful", res);

      // [SỬA] Cập nhật user + token (nếu muốn nhớ lâu hơn có thể truyền remember vào context)
      // VD nếu AuthContext hỗ trợ: login(res.user, res.token, { remember })
      login(res.user, res.token);

      // [SỬA] Điều hướng thông minh:
      // - Nếu đang login để vào trang bị chặn => quay lại trang đó (from)
      // - Nếu là Admin => sang /admin
      // - Ngược lại => về trang chủ
      const from = loc.state?.from?.pathname || "/";
      const isAdmin = String(res.user?.role) === "Admin";
      const target = isAdmin ? "/admin" : from;
      navigate(target, { replace: true });
    } catch (err) {
      console.error("Login failed", err?.response?.data || err?.message);
      alert(err?.response?.data || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 bg-white/95 backdrop-blur-lg transition-all duration-300">
        {/* Logo + title */}
        <div className="text-center mb-8">
          {/* Brand title giống trang chủ */}
          <Link to="/" className="inline-flex items-end justify-center gap-2">
            <img
              src="/images/logo.png"
              alt="CleanMate"
              className="h-10 w-auto"
            />
            <span
              style={{ fontFamily: '"Pacifico", cursive', lineHeight: 1 }}
              className="text-3xl"
            >
              <span className="text-emerald-600">Clean</span>
              <span className="text-amber-500">Mate</span>
            </span>
          </Link>

          <p className="text-gray-600 mt-2">Dịch vụ giúp việc theo giờ</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email */}
          <div className="transition-all duration-200 focus-within:scale-[1.02] focus-within:shadow-lg rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="transition-all duration-200 focus-within:scale-[1.02] focus-within:shadow-lg rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPwd ? (
                  // Eye-off
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  // Eye
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <button
              type="button"
              onClick={() => alert("Demo: Quên mật khẩu")}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-white bg-gradient-to-r from-emerald-600 to-amber-500
              hover:from-emerald-500 hover:to-amber-400 btn-hover ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Đăng ký */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>

        {/* Social buttons ... (đang để comment giữ nguyên) */}
      </div>
    </div>
  );
}
