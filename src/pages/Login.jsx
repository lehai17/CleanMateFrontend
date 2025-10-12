// src/pages/Login.jsx
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await loginApi(email, password);
  //     localStorage.setItem("cm_token", res.token);
  //     localStorage.setItem("cm_user", JSON.stringify(res.user));
  //     navigate("/"); // hoặc trang chủ
  //   } catch (err) {
  //     alert(err?.response?.data || "Đăng nhập thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login(res.user, res.token); // cập nhật context + localStorage
      navigate("/");
    } catch (err) {
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

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Hoặc đăng nhập bằng
              </span>
            </div>
          </div>

          {/* Social buttons: giữ nguyên Google & Facebook */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <GoogleLogin
              onSuccess={async (cred) => {
                try {
                  const { data } = await api.post("/api/auth/google", {
                    IdToken: cred.credential,
                  });
                  // cập nhật context
                  login(data.user, data.token);
                  navigate("/");
                } catch (err) {
                  alert("Google login failed");
                }
              }}
              onError={() => alert("Google login error")}
              shape="rectangular"
              text="continue_with"
            />

            <button
              type="button"
              onClick={() => alert("Demo: Facebook Login")}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
