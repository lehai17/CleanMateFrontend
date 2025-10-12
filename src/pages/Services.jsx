// src/pages/Services.jsx
import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

/**
 * Nếu đã có AuthContext, thay props bằng:
 *   import { useAuth } from "../contexts/AuthContext"; // chỉnh đường dẫn cho đúng
 *   const { user, logout } = useAuth();
 * Ở đây mình để Services nhận props để tránh lỗi 'user is not defined' như trước.
 */
export default function Services({ user = null, logout = () => {} }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // refs để áp entrance animation nhẹ khi scroll
  const serviceRefs = useRef([]);
  const comboRefs = useRef([]);

  useEffect(() => {
    const els = [...serviceRefs.current, ...comboRefs.current].filter(Boolean);
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const services = [
    {
      icon: "🧽",
      title: "Dọn dẹp nhà cửa",
      desc: "Vệ sinh tổng quát, lau chùi và sắp xếp gọn gàng",
      price: "70,000đ/giờ",
      btnGrad: "from-emerald-500 to-teal-600",
    },
    {
      icon: "👕",
      title: "Ủi quần áo",
      desc: "Ủi là chuyên nghiệp, quần áo phẳng phiu",
      price: "40,000đ/giờ",
      btnGrad: "from-amber-500 to-orange-600",
    },
    {
      icon: "👩‍🍳",
      title: "Nấu ăn tại nhà",
      desc: "Chế biến món ăn ngon (không bao gồm nguyên liệu)",
      price: "50,000đ/giờ",
      btnGrad: "from-teal-500 to-emerald-600",
    },
    {
      icon: "👶",
      title: "Trông trẻ",
      desc: "Chăm sóc trẻ em an toàn và chu đáo",
      price: "120,000đ/giờ",
      btnGrad: "from-rose-500 to-pink-600",
    },
    {
      icon: "👴",
      title: "Chăm sóc người già",
      desc: "Chăm sóc sức khỏe và sinh hoạt hàng ngày",
      price: "150,000đ/giờ",
      btnGrad: "from-orange-500 to-amber-600",
    },
  ];

  const combos = [
    {
      ribbon: "TIẾT KIỆM 10K",
      theme: "blue",
      emoji: "✨",
      name: 'Gói "Sạch bóng"',
      items: ["2 giờ dọn dẹp nhà cửa", "1 giờ ủi quần áo"],
      oldPrice: "180,000đ",
      newPrice: "170,000đ",
      btnGrad: "from-emerald-500 to-amber-500",
      badge: null,
    },
    {
      ribbon: "TIẾT KIỆM 10K",
      theme: "green",
      emoji: "🍽️",
      name: 'Gói "Cơm nhà"',
      items: ["2 giờ dọn dẹp nhà cửa", "1 giờ nấu ăn tại nhà"],
      oldPrice: "190,000đ",
      newPrice: "180,000đ",
      btnGrad: "from-teal-500 to-emerald-600",
      badge: null,
    },
    {
      ribbon: "TIẾT KIỆM 20K",
      theme: "purple",
      emoji: "👑",
      name: 'Gói "Chăm nhà A-Z"',
      items: [
        "2 giờ dọn dẹp nhà cửa",
        "2 giờ nấu ăn tại nhà",
        "1 giờ ủi quần áo",
      ],
      oldPrice: "280,000đ",
      newPrice: "260,000đ",
      btnGrad: "from-amber-500 to-orange-600",
      badge: "PHỔ BIẾN NHẤT",
    },
  ];

  const toBooking = () => navigate("/booking");
  const toConsult = () => navigate("/consult");
  const pickCombo = (name) => navigate("/checkout", { state: { plan: name } });

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-amber-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-5">
            Tất cả{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              dịch vụ
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dịch vụ gia đình chuyên nghiệp với bảng giá minh bạch
            và combo siêu tiết kiệm.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <span className="bg-white rounded-full px-5 py-2.5 shadow border border-emerald-100">
              <span className="text-emerald-700 font-semibold">
                📋 Bảng giá chi tiết
              </span>
            </span>
            <span className="bg-white rounded-full px-5 py-2.5 shadow border border-amber-100">
              <span className="text-amber-700 font-semibold">
                🎁 Gói combo tiết kiệm
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              💰 Bảng giá dịch vụ theo giờ
            </h2>
            <p className="text-gray-600">
              Giá cả minh bạch, chất lượng đảm bảo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <div
                key={s.title}
                ref={(el) => (serviceRefs.current[idx] = el)}
                className="service-card bg-white rounded-2xl p-7 shadow-xl hover:shadow-2xl border border-gray-100"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="text-4xl">{s.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 mb-5">{s.desc}</p>
                  <div className="text-1xl md:text-2xl font-black bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent mb-5">
                    {s.price}
                  </div>
                  <button
                    onClick={toBooking}
                    className={`w-full bg-gradient-to-r ${s.btnGrad} text-white py-3.5 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow`}
                  >
                    Đặt ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              🎁 Gói combo tiết kiệm
            </h2>
            <p className="text-gray-600">
              Kết hợp nhiều dịch vụ với giá ưu đãi hấp dẫn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {combos.map((c, idx) => (
              <div
                key={c.name}
                ref={(el) => (comboRefs.current[idx] = el)}
                className={`combo-card relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl border-2 ${
                  c.theme === "blue"
                    ? "border-emerald-100 hover:border-emerald-300"
                    : c.theme === "green"
                    ? "border-teal-100 hover:border-teal-300"
                    : "border-amber-100 hover:border-amber-300"
                }`}
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1.5 rounded-bl-2xl font-bold text-xs">
                  {c.ribbon}
                </div>
                {c.badge && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                    {c.badge}
                  </div>
                )}

                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">{c.emoji}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {c.name}
                  </h3>

                  <div className="rounded-2xl p-6 mb-6 border border-gray-100 bg-gradient-to-br from-white to-emerald-50/40">
                    <ul className="space-y-2 text-left">
                      {c.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center text-gray-700"
                        >
                          <span className="mr-3">✅</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <div className="text-gray-500 line-through mb-1">
                      {c.oldPrice}
                    </div>
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                      {c.newPrice}
                    </div>
                  </div>

                  <button
                    onClick={() => pickCombo(c.name)}
                    className={`w-full bg-gradient-to-r ${c.btnGrad} text-white py-4 px-6 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl`}
                  >
                    Chọn gói này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Sẵn sàng trải nghiệm dịch vụ tuyệt vời? 🌟
          </h2>
          <p className="text-emerald-50/95 text-lg mb-8">
            Đặt lịch ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={toBooking}
              className="bg-white text-emerald-700 px-7 py-3.5 rounded-full text-lg font-bold hover:bg-gray-100 shadow"
            >
              Đặt lịch ngay 📞
            </button>
            <button
              onClick={toConsult}
              className="border-2 border-white text-white px-7 py-3.5 rounded-full text-lg font-bold hover:bg-white hover:text-emerald-700 transition"
            >
              Tư vấn miễn phí 💬
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
