// src/App.js
import { useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Policies from "./pages/Policies";
import PrivateRoute from "./components/PrivateRoute";
import Booking from "./pages/Booking";
import Services from "./pages/Services";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Order from "./pages/Order";
import PaymentQR from "./pages/PaymentQR";

function CleanMateLanding() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onBook = () => navigate("/booking");
  const onExplore = () => navigate("/services");

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onButtonClick = (label) => {
    if (label.includes("Đặt lịch")) {
      alert(
        "Chức năng đặt lịch sẽ được triển khai sớm! Vui lòng gọi hotline 1900 1234 để đặt lịch."
      );
    } else if (label.includes("Xem giá")) {
      scrollToId("services");
    } else if (label.includes("Đăng ký")) {
      navigate("/register");
    } else if (label.includes("Đăng nhập")) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <style>{`@keyframes cm-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }`}</style>

      {/* Hero */}
      <section className="bg-gradient-to-tr from-emerald-600 to-amber-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Giúp việc chuyên nghiệp{" "}
                <span className="text-amber-300">theo giờ</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Đặt lịch dễ dàng, giúp việc đến tận nhà. Tiết kiệm thời gian, an
                tâm chất lượng với CleanMate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/booking")}
                  className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
                >
                  Đặt lịch ngay
                </button>
                <button
                  onClick={(e) =>
                    onButtonClick(e.currentTarget.textContent || "")
                  }
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-lg"
                >
                  Xem giá dịch vụ
                </button>
              </div>
            </div>
            <div className="relative">
              <div style={{ animation: "cm-float 6s ease-in-out infinite" }}>
                <svg
                  className="w-full h-96"
                  viewBox="0 0 400 400"
                  fill="none"
                  aria-hidden
                >
                  {/* House */}
                  <rect
                    x="100"
                    y="200"
                    width="200"
                    height="150"
                    fill="#10B981"
                    rx="10"
                  />
                  <polygon points="90,200 200,120 310,200" fill="#F59E0B" />
                  <rect x="140" y="240" width="40" height="60" fill="#F59E0B" />
                  <rect x="220" y="240" width="40" height="40" fill="#BBF7D0" />
                  <circle cx="175" cy="270" r="3" fill="#374151" />

                  {/* Cleaning elements */}
                  <circle
                    cx="320"
                    cy="180"
                    r="30"
                    fill="#F59E0B"
                    opacity="0.9"
                  />
                  <text x="320" y="190" textAnchor="middle" fontSize="22">
                    ✨
                  </text>
                  <circle
                    cx="80"
                    cy="160"
                    r="25"
                    fill="#10B981"
                    opacity="0.9"
                  />
                  <text x="80" y="170" textAnchor="middle" fontSize="20">
                    🧽
                  </text>
                  <circle
                    cx="350"
                    cy="280"
                    r="20"
                    fill="#F59E0B"
                    opacity="0.8"
                  />
                  <text x="350" y="290" textAnchor="middle" fontSize="18">
                    🧹
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn CleanMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến dịch vụ giúp việc chuyên nghiệp, tiện lợi và
              đáng tin cậy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="Đặt lịch nhanh chóng"
              desc="Chỉ cần 2 phút để đặt lịch online. Chọn thời gian phù hợp với bạn."
              gradient="from-emerald-50 to-emerald-100"
            />
            <FeatureCard
              icon="👥"
              title="Nhân viên chuyên nghiệp"
              desc="Đội ngũ được đào tạo bài bản, có kinh nghiệm và được kiểm tra kỹ lưỡng."
              gradient="from-emerald-50 to-amber-50"
            />
            <FeatureCard
              icon="🛡️"
              title="Bảo hiểm toàn diện"
              desc="An tâm với chế độ bảo hiểm và cam kết chất lượng dịch vụ."
              gradient="from-amber-50 to-amber-100"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-20 relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-600 text-white"
      >
        {/* Minimal animation helpers so it works out of the box */}
        <style>{`
        /* generic helpers */
        .animation-delay-2000{ animation-delay: .2s; }
        .animation-delay-4000{ animation-delay: .4s; }
        .animation-delay-6000{ animation-delay: .6s; }

        /* blobs */
        @keyframes dv-blob {
          0%{ transform: translate(0,0) scale(1) }
          33%{ transform: translate(10px,-20px) scale(1.05) }
          66%{ transform: translate(-10px,10px) scale(.98) }
          100%{ transform: translate(0,0) scale(1) }
        }
        .animate-blob{ animation: dv-blob 16s ease-in-out infinite; }

        /* orbit */
        @keyframes dv-orbit-1{ from{ transform:rotate(0)} to{ transform:rotate(360deg)} }
        @keyframes dv-orbit-2{ from{ transform:rotate(360deg)} to{ transform:rotate(0)} }
        @keyframes dv-orbit-3{ 0%{ transform:rotate(0)} 50%{ transform:rotate(180deg) } 100%{ transform:rotate(360deg)} }
        .animate-orbit-1{ animation: dv-orbit-1 18s linear infinite; }
        .animate-orbit-2{ animation: dv-orbit-2 22s linear infinite; }
        .animate-orbit-3{ animation: dv-orbit-3 26s linear infinite; }
        
        /* particles */
        @keyframes dv-particle { 
          0%{ transform: translateY(0) translateX(0); opacity:.8 }
          50%{ transform: translateY(-20px) translateX(10px); opacity:.6 }
          100%{ transform: translateY(0) translateX(0); opacity:.8 }
        }
        .animate-particle-1,.animate-particle-2,.animate-particle-3,.animate-particle-4,
        .animate-particle-5,.animate-particle-6,.animate-particle-7,.animate-particle-8{
          animation: dv-particle 6s ease-in-out infinite;
        }

        /* geometric */
        @keyframes dv-geo-1{ 0%,100%{ transform: rotate(45deg)} 50%{ transform: rotate(90deg)} }
        @keyframes dv-geo-2{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-10px)} }
        @keyframes dv-geo-3{ 0%,100%{ transform: rotate(12deg)} 50%{ transform: rotate(-12deg)} }
        .animate-geometric-1{ animation: dv-geo-1 10s ease-in-out infinite; }
        .animate-geometric-2{ animation: dv-geo-2 8s ease-in-out infinite; }
        .animate-geometric-3{ animation: dv-geo-3 12s ease-in-out infinite; }

        /* titles */
        @keyframes dv-title-in{ from{opacity:0; transform: translateY(12px)} to{opacity:1; transform:none} }
        .animate-title-entrance{ animation: dv-title-in .7s ease both; }
        @keyframes dv-text-glow{
          0%,100%{ text-shadow: 0 0 0 rgba(255,255,255,.0) }
          50%{ text-shadow: 0 0 24px rgba(255,255,255,.25) }
        }
        .animate-text-glow{ animation: dv-text-glow 3s ease-in-out infinite; }
        @keyframes dv-rainbow{
          0%{ background-position: 0% }
          100%{ background-position: 200% }
        }
        .animate-rainbow-flow{ background-size: 200% 100%; animation: dv-rainbow 4s linear infinite; }
        .animate-fade-up{ animation: dv-title-in .8s .1s ease both; }

        /* cards */
        @keyframes dv-card-in{ from{opacity:0; transform: translateY(16px) scale(.98)} to{opacity:1; transform:none} }
        .animate-card-entrance{ animation: dv-card-in .7s ease both; }
        @keyframes dv-border-glow{
          0%,100%{ opacity:.25 } 50%{ opacity:.9 }
        }
        .animate-border-glow{ animation: dv-border-glow 3s ease-in-out infinite; }

        /* icon stack */
        @keyframes dv-layer-rot{ 0%{ transform: rotate(0)} 100%{ transform: rotate(360deg)} }
        .animate-layer-1,.animate-layer-2,.animate-layer-3{ animation: dv-layer-rot 18s linear infinite; }
        @keyframes dv-float{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-8px)} }
        .animate-icon-float{ animation: dv-float 5s ease-in-out infinite; }
        @keyframes dv-dance{ 0%,100%{ transform: rotate(0)} 50%{ transform: rotate(6deg)} }
        .animate-icon-dance{ animation: dv-dance 2.8s ease-in-out infinite; }

        /* sparkles + rings */
        @keyframes dv-spark{ 0%,100%{ transform: scale(1)} 50%{ transform: scale(1.2)} }
        .animate-sparkle-1,.animate-sparkle-2,.animate-sparkle-3,.animate-sparkle-4{ animation: dv-spark 2.4s ease-in-out infinite; }
        @keyframes dv-ring{ 0%{ opacity:.4} 50%{ opacity:.8} 100%{ opacity:.4} }
        .animate-ring-1,.animate-ring-2{ animation: dv-ring 3.2s ease-in-out infinite; }

        /* text / price / button */
        @keyframes dv-shimmer{ 0%{ background-position:0% 50% } 100%{ background-position:200% 50% } }
        .animate-text-shimmer{ background-size:200% 100%; animation: dv-shimmer 3.2s linear infinite; }
        @keyframes dv-price-glow{ 0%,100%{ filter: drop-shadow(0 0 0 rgba(255,255,255,0)) } 50%{ filter: drop-shadow(0 0 18px rgba(255,255,255,.35)) } }
        .animate-price-glow{ animation: dv-price-glow 3s ease-in-out infinite; }
        @keyframes dv-btn{ 0%,100%{ transform: scale(1)} 50%{ transform: scale(1.02)} }
        .animate-button-pulse{ animation: dv-btn 1.6s ease-in-out infinite; }
        @keyframes dv-bounce{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-2px)} }
        .animate-text-bounce{ animation: dv-bounce 1.8s ease-in-out infinite; }

        /* CTA */
        @keyframes dv-cta-in{ from{ opacity:0; transform: translateY(8px)} to{ opacity:1; transform:none } }
        .animate-cta-entrance{ animation: dv-cta-in .6s ease both; }
        @keyframes dv-mega-pulse{ 0%,100%{ opacity:.55 } 50%{ opacity:.9 } }
        .animate-mega-pulse{ animation: dv-mega-pulse 2.2s ease-in-out infinite; }
        @keyframes dv-mega-btn{ 0%,100%{ transform: scale(1) } 50%{ transform: scale(1.03) } }
        .animate-mega-button{ animation: dv-mega-btn 2.2s ease-in-out infinite; }
        .animate-mega-text{ animation: dv-bounce 2.6s ease-in-out infinite; }
        .glass-effect-ultra{ background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06)); border:1px solid rgba(255,255,255,.14); backdrop-filter: blur(10px); }
      `}</style>

        {/* Ultra Dynamic Background (brand-colors) */}
        <div className="absolute inset-0">
          {/* Blobs */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-amber-300 via-emerald-400 to-emerald-700 rounded-full mix-blend-multiply blur-2xl opacity-60 animate-blob" />
          <div className="absolute top-0 right-4 w-80 h-80 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-600 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-emerald-300 via-emerald-500 to-amber-500 rounded-full mix-blend-multiply blur-2xl opacity-65 animate-blob animation-delay-4000" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-emerald-400 via-emerald-600 to-amber-600 rounded-full mix-blend-multiply blur-2xl opacity-55 animate-blob animation-delay-6000" />

          {/* Orbiting elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 animate-orbit-1">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full shadow-lg opacity-80" />
          </div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 animate-orbit-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-200 to-emerald-400 rounded-full shadow-lg opacity-70" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 animate-orbit-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-200 to-amber-300 rounded-full shadow-lg opacity-70" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full opacity-80 animate-particle-1" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-300 rounded-full opacity-90 animate-particle-2" />
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-emerald-200 rounded-full opacity-70 animate-particle-3" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-emerald-300 rounded-full opacity-85 animate-particle-4" />
          <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-amber-200 rounded-full opacity-75 animate-particle-5" />
          <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-80 animate-particle-6" />
          <div className="absolute top-1/6 right-1/6 w-3 h-3 bg-amber-300 rounded-full opacity-70 animate-particle-7" />
          <div className="absolute bottom-1/6 left-1/6 w-2 h-2 bg-emerald-200 rounded-full opacity-85 animate-particle-8" />
        </div>

        {/* Geometrics */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-32 w-16 h-16 border-2 border-white/20 rotate-45 animate-geometric-1" />
          <div className="absolute bottom-32 left-32 w-12 h-12 border-2 border-emerald-200/30 animate-geometric-2" />
          <div className="absolute top-1/2 left-16 w-20 h-20 border-2 border-amber-200/25 rotate-12 animate-geometric-3" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 animate-title-entrance">
              <h2 className="text-4xl md:text-8xl font-black bg-gradient-to-r from-white via-emerald-100 to-amber-100 bg-clip-text text-transparent mb-6 animate-text-glow">
                Dịch vụ của chúng tôi
              </h2>
              <div className="h-2 w-48 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 mx-auto rounded-full animate-rainbow-flow" />
            </div>
            <p className="text-2xl text-emerald-50/95 max-w-4xl mx-auto leading-relaxed animate-fade-up">
              Trải nghiệm dịch vụ gia đình đẳng cấp với công nghệ hiện đại và
              đội ngũ chuyên nghiệp
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cleaning */}
            <div className="group relative service-card-3d animate-card-entrance">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-90 transition-all duration-700 animate-border-glow" />
              <div className="relative glass-effect-ultra rounded-3xl p-8 text-center hover:border-white/60 transition-all duration-700">
                {/* 3D icon */}
                <div className="relative w-32 h-32 mx-auto mb-8 icon-3d-ultra">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 rounded-3xl transform rotate-12 group-hover:rotate-45 transition-transform duration-1000 animate-layer-1" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-emerald-400 to-amber-500 rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-transform duration-1000 animate-layer-2" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-300 to-amber-400 rounded-3xl transform rotate-6 group-hover:rotate-90 transition-transform duration-1000 animate-layer-3" />
                  <div className="relative bg-gradient-to-br from-emerald-200 via-emerald-400 to-amber-500 rounded-3xl h-full flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/70 transition-all duration-700 animate-icon-float">
                    <div className="text-5xl animate-icon-dance">🧽</div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-300 rounded-full animate-sparkle-1 opacity-90" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-300 rounded-full animate-sparkle-2 opacity-80" />
                  <div className="absolute top-1/2 -right-4 w-3 h-3 bg-amber-200 rounded-full animate-sparkle-3 opacity-75" />
                  <div className="absolute -top-1 left-1/2 w-5 h-5 bg-emerald-200 rounded-full animate-sparkle-4 opacity-85" />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ring-1" />
                  <div className="absolute inset-2 border-2 border-emerald-200/40 rounded-full animate-ring-2" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors animate-text-shimmer">
                  Dọn dẹp nhà cửa
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed animate-fade-up">
                  Vệ sinh tổng quát cẩn thận, lau chùi tinh tế và sắp xếp gọn
                  gàng
                </p>
                <div className="text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-6 animate-price-glow">
                  70.000đ/giờ
                </div>
                <button
                  onClick={onBook}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-emerald-600 hover:via-emerald-700 hover:to-amber-600 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-emerald-500/40 animate-button-pulse"
                >
                  <span className="relative z-10 animate-text-bounce">
                    Đặt ngay ✨
                  </span>
                </button>
              </div>
            </div>

            {/* Cooking */}
            <div className="group relative service-card-3d animate-card-entrance animation-delay-2000">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-90 transition-all duration-700 animate-border-glow" />
              <div className="relative glass-effect-ultra rounded-3xl p-8 text-center hover:border-white/60 transition-all duration-700">
                <div className="relative w-32 h-32 mx-auto mb-8 icon-3d-ultra">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-300 via-emerald-500 to-amber-600 rounded-3xl transform rotate-12 group-hover:rotate-45 transition-transform duration-1000 animate-layer-1" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-teal-400 to-amber-500 rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-transform duration-1000 animate-layer-2" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-300 to-amber-400 rounded-3xl transform rotate-6 group-hover:rotate-90 transition-transform duration-1000 animate-layer-3" />
                  <div className="relative bg-gradient-to-br from-emerald-200 via-teal-400 to-amber-500 rounded-3xl h-full flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/70 transition-all duration-700 animate-icon-float">
                    <div className="text-5xl animate-icon-dance">👩‍🍳</div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-300 rounded-full animate-sparkle-1 opacity-90" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-300 rounded-full animate-sparkle-2 opacity-80" />
                  <div className="absolute top-1/2 -right-4 w-3 h-3 bg-amber-200 rounded-full animate-sparkle-3 opacity-75" />
                  <div className="absolute -top-1 left-1/2 w-5 h-5 bg-emerald-200 rounded-full animate-sparkle-4 opacity-85" />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ring-1" />
                  <div className="absolute inset-2 border-2 border-emerald-200/40 rounded-full animate-ring-2" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors animate-text-shimmer">
                  Nấu ăn & Rửa bát
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed animate-fade-up">
                  Chế biến món ngon mỗi ngày và vệ sinh bếp núc sạch sẽ
                </p>
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-200 via-emerald-300 to-amber-400 bg-clip-text text-transparent mb-6 animate-price-glow">
                  90.000đ/giờ
                </div>
                <button
                  onClick={onBook}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-amber-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-emerald-600 hover:via-teal-700 hover:to-amber-600 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-emerald-500/40 animate-button-pulse"
                >
                  <span className="relative z-10 animate-text-bounce">
                    Đặt ngay 🍳
                  </span>
                </button>
              </div>
            </div>

            {/* Laundry */}
            <div className="group relative service-card-3d animate-card-entrance animation-delay-4000">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-90 transition-all duration-700 animate-border-glow" />
              <div className="relative glass-effect-ultra rounded-3xl p-8 text-center hover:border-white/60 transition-all duration-700">
                <div className="relative w-32 h-32 mx-auto mb-8 icon-3d-ultra">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-emerald-500 to-amber-600 rounded-3xl transform rotate-12 group-hover:rotate-45 transition-transform duration-1000 animate-layer-1" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-emerald-400 to-amber-500 rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-transform duration-1000 animate-layer-2" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-300 to-amber-400 rounded-3xl transform rotate-6 group-hover:rotate-90 transition-transform duration-1000 animate-layer-3" />
                  <div className="relative bg-gradient-to-br from-emerald-200 via-emerald-400 to-amber-500 rounded-3xl h-full flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/70 transition-all duration-700 animate-icon-float">
                    <div className="text-5xl animate-icon-dance">👕</div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-300 rounded-full animate-sparkle-1 opacity-90" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-300 rounded-full animate-sparkle-2 opacity-80" />
                  <div className="absolute top-1/2 -right-4 w-3 h-3 bg-amber-200 rounded-full animate-sparkle-3 opacity-75" />
                  <div className="absolute -top-1 left-1/2 w-5 h-5 bg-emerald-200 rounded-full animate-sparkle-4 opacity-85" />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ring-1" />
                  <div className="absolute inset-2 border-2 border-emerald-200/40 rounded-full animate-ring-2" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors animate-text-shimmer">
                  Giặt ủi quần áo
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed animate-fade-up">
                  Giặt – phơi – ủi chuyên nghiệp, bảo quản quần áo như mới
                </p>
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-200 via-emerald-300 to-amber-400 bg-clip-text text-transparent mb-6 animate-price-glow">
                  70.000đ/giờ
                </div>
                <button
                  onClick={onBook}
                  className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-emerald-700 hover:via-emerald-800 hover:to-amber-700 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-emerald-600/40 animate-button-pulse"
                >
                  <span className="relative z-10 animate-text-bounce">
                    Đặt ngay 👔
                  </span>
                </button>
              </div>
            </div>

            {/* Childcare */}
            <div className="group relative service-card-3d animate-card-entrance animation-delay-6000">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-90 transition-all duration-700 animate-border-glow" />
              <div className="relative glass-effect-ultra rounded-3xl p-8 text-center hover:border-white/60 transition-all duration-700">
                <div className="relative w-32 h-32 mx-auto mb-8 icon-3d-ultra">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-emerald-500 to-amber-700 rounded-3xl transform rotate-12 group-hover:rotate-45 transition-transform duration-1000 animate-layer-1" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-amber-400 to-amber-600 rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-transform duration-1000 animate-layer-2" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-amber-300 to-amber-500 rounded-3xl transform rotate-6 group-hover:rotate-90 transition-transform duration-1000 animate-layer-3" />
                  <div className="relative bg-gradient-to-br from-amber-200 via-emerald-400 to-amber-600 rounded-3xl h-full flex items-center justify-center shadow-2xl group-hover:shadow-amber-500/70 transition-all duration-700 animate-icon-float">
                    <div className="text-5xl animate-icon-dance">👶</div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-300 rounded-full animate-sparkle-1 opacity-90" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-300 rounded-full animate-sparkle-2 opacity-80" />
                  <div className="absolute top-1/2 -right-4 w-3 h-3 bg-amber-200 rounded-full animate-sparkle-3 opacity-75" />
                  <div className="absolute -top-1 left-1/2 w-5 h-5 bg-emerald-200 rounded-full animate-sparkle-4 opacity-85" />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ring-1" />
                  <div className="absolute inset-2 border-2 border-amber-200/40 rounded-full animate-ring-2" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-100 transition-colors animate-text-shimmer">
                  Chăm sóc trẻ em
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed animate-fade-up">
                  Trông trẻ an tâm – Hoạt động phù hợp độ tuổi – Giao tiếp thân
                  thiện
                </p>
                <div className="text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-6 animate-price-glow">
                  100.000đ/giờ
                </div>
                <button
                  onClick={onBook}
                  className="w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-emerald-600 hover:via-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-amber-500/40 animate-button-pulse"
                >
                  <span className="relative z-10 animate-text-bounce">
                    Đặt ngay 💖
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="inline-block relative animate-cta-entrance">
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-600 rounded-3xl blur-xl opacity-80 animate-mega-pulse" />
              <button
                onClick={onExplore}
                className="relative bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-600 text-white px-16 py-6 rounded-3xl font-black text-2xl hover:from-amber-500 hover:via-emerald-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-110 hover:rotate-2 shadow-2xl hover:shadow-emerald-500/50 animate-mega-button"
              >
                <span className="relative z-10 animate-mega-text">
                  Khám phá tất cả dịch vụ 🌟
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ 3 bước đơn giản để có dịch vụ giúp việc chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number={1}
              title="Đặt lịch online"
              desc="Chọn dịch vụ, thời gian và địa chỉ phù hợp với bạn"
            />
            <Step
              number={2}
              title="Xác nhận & thanh toán"
              desc="Nhận xác nhận đặt lịch và thanh toán trực tuyến an toàn"
            />
            <Step
              number={3}
              title="Nhận dịch vụ"
              desc="Nhân viên đến đúng giờ và thực hiện công việc chuyên nghiệp"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng trải nghiệm dịch vụ?
          </h2>
          <p className="text-xl mb-8 text-emerald-100/90">
            Hàng nghìn khách hàng đã tin tưởng CleanMate. Hãy để chúng tôi giúp
            bạn tiết kiệm thời gian!
          </p>
          <button
            onClick={(e) => onButtonClick(e.currentTarget.textContent || "")}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors text-lg"
          >
            Đặt lịch ngay - Miễn phí tư vấn
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <div
      className={`text-center p-8 rounded-xl bg-gradient-to-br ${gradient} hover:shadow-lg transition-shadow`}
    >
      <div className="text-4xl mb-4" aria-hidden>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function ServiceCard({ icon, title, desc, price }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transform transition duration-300 hover:-translate-y-1">
      <div className="text-3xl mb-4" aria-hidden>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{desc}</p>
      <div className="text-emerald-600 font-semibold">{price}</div>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CleanMateLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/policies" element={<Policies />} />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route path="/services" element={<Services />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/payment-qr" element={<PaymentQR />} />
      </Routes>
      <Footer />
    </>
  );
}
