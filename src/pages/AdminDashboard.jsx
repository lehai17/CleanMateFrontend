// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ===== Helper formatters =====
const formatNumber = (n) =>
  new Intl.NumberFormat("vi-VN").format(Math.floor(n));

const formatCurrencyCompact = (n) =>
  `₫${new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)}`;

// ===== Reusable Stat Card with animation =====
function StatCard({
  title,
  value,
  icon,
  trendText,
  trendColor = "text-green-600",
  subText,
  type = "number",
  bgIcon = "bg-blue-100",
  iconColor = "text-blue-600",
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // requestAnimationFrame counter
    let raf;
    const start = performance.now();
    const duration = 1200; // ms

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(value * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const shown = useMemo(() => {
    if (type === "money") return formatCurrencyCompact(display);
    return formatNumber(display);
  }, [display, type]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{shown}</p>
          <div className="flex items-center mt-3">
            {/* Arrow up icon */}
            <svg
              className={`w-4 h-4 mr-1 ${trendColor.replace(
                "text-",
                "stroke-"
              )}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 17l9.2-9.2M17 17V7H7"
              ></path>
            </svg>
            <span className={`text-sm font-medium ${trendColor}`}>
              {trendText}
            </span>
            {subText && (
              <span className="text-sm text-gray-500 ml-1">{subText}</span>
            )}
          </div>
        </div>
        <div className={`${bgIcon} p-4 rounded-full`}>
          {/* Custom icon per-card */}
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// ===== Small row components =====
function ActivityItem({ color = "blue", title, subtitle, right }) {
  const colorMap = {
    blue: ["bg-blue-100", "text-blue-600"],
    green: ["bg-green-100", "text-green-600"],
    purple: ["bg-purple-100", "text-purple-600"],
    red: ["bg-red-100", "text-red-600"],
  };
  const [bg, text] = colorMap[color] || colorMap.blue;

  const icons = {
    blue: (
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
    ),
    green: (
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    purple: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
    ),
    red: (
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        ></path>
      </svg>
    ),
  };

  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}
      >
        <span className={text}>{icons[color]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <span className={`text-sm ${text} font-medium`}>{right}</span>
    </div>
  );
}

function ServiceRow({
  rank,
  color = "blue",
  name,
  bookings,
  revenue,
  progress = 0.5,
}) {
  const colorMap = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    red: "bg-red-600",
  };
  const badgeMap = {
    blue: ["bg-blue-100", "text-blue-600"],
    green: ["bg-green-100", "text-green-600"],
    purple: ["bg-purple-100", "text-purple-600"],
    orange: ["bg-orange-100", "text-orange-600"],
    red: ["bg-red-100", "text-red-600"],
  };

  const bar = colorMap[color] || colorMap.blue;
  const [badgeBg, badgeText] = badgeMap[color] || badgeMap.blue;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 ${badgeBg} rounded-lg flex items-center justify-center`}
        >
          <span className={`text-sm font-bold ${badgeText}`}>{rank}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{bookings} booking</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatCurrencyCompact(revenue)}
        </p>
        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
          <div
            className={`${bar} h-2 rounded-full`}
            style={{ width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // ====== Mock state (range selector chưa cần xử lý logic theo yêu cầu) ======
  const [range, setRange] = useState("30d");

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    try {
      logout(); // xóa token/user trong AuthContext
    } finally {
      navigate("/login", { replace: true }); // quay về trang login
    }
  };

  // ====== Mock data ======
  const stats = [
    {
      key: "bookings",
      title: "Tổng booking",
      value: 46,
      //   trendText: "+12.5%",
      //   subText: "so với tháng trước",
      type: "number",
      bgIcon: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      key: "revenue",
      title: "Doanh thu",
      value: 4300000,
      //   trendText: "+18.2%",
      //   subText: "so với tháng trước",
      type: "money",
      bgIcon: "bg-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          ></path>
        </svg>
      ),
    },
    {
      key: "customers",
      title: "Khách hàng",
      value: 203,
      //   trendText: "+8.1%",
      //   subText: "so với tháng trước",
      type: "number",
      bgIcon: "bg-purple-100",
      iconColor: "text-purple-600",
      //   icon: (
      //     <svg
      //       className="w-8 h-8"
      //       fill="none"
      //       stroke="currentColor"
      //       viewBox="0 0 24 24"
      //     >
      //       <path
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //         strokeWidth="2"
      //         d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      //       ></path>
      //     </svg>
      //   ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===== Page container ===== */}
      <div className="p-6">
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <img
              src="/images/logo.png" // ảnh để trong public/images
              alt="CleanMate"
              className="h-10 w-auto mr-3"
              loading="lazy"
            />
            CleanMate Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-gray-500">
            👋 {user?.fullName || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Đăng xuất
          </button>
        </div>

        {/* ===== Stat cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {stats.map((s) => (
            <StatCard key={s.key} {...s} />
          ))}
        </div>

        {/* ===== Activities & Services ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top services */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Dịch vụ phổ biến
            </h3>
            <div className="space-y-4">
              <ServiceRow
                rank={1}
                color="blue"
                name="Dọn dẹp nhà cửa"
                bookings={43}
                revenue={4030000}
                progress={0.85}
              />
              <ServiceRow
                rank={3}
                color="purple"
                name="Nấu ăn gia đình"
                bookings={3}
                revenue={270000}
                progress={0.15}
              />
              <ServiceRow
                rank={2}
                color="green"
                name="Giặt ủi quần áo"
                bookings={0}
                revenue={0}
                progress={0}
              />
              <ServiceRow
                rank={4}
                color="orange"
                name="Chăm sóc trẻ em"
                bookings={0}
                revenue={0}
                progress={0}
              />
              <ServiceRow
                rank={5}
                color="red"
                name="Chăm sóc người già"
                bookings={0}
                revenue={0}
                progress={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
