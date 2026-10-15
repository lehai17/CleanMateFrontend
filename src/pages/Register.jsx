import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await registerApi({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        address: "",
        role: "Customer",
      });
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-emerald-600 to-amber-500 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-6 text-center">
          <img src="/images/logo.png" alt="CleanMate" className="mx-auto h-10 w-auto" />
          <h1 className="mb-1 text-2xl font-semibold text-gray-900">Đăng ký CleanMate</h1>
          <p className="text-gray-600">Tạo tài khoản khách hàng mới</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập email của bạn"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="font-medium text-amber-600 hover:text-amber-700">
                  Chính sách bảo mật
                </a>
              </span>
            </label>
            {errors.acceptTerms && <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-amber-500 px-4 py-3 font-semibold text-white transition-all hover:from-emerald-500 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-700">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
