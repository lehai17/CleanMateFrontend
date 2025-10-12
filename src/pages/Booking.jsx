import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createBooking } from "../api/bookings";
import Header from "../components/Header";

/* =========================
   Data & Helpers
========================= */
const API_URL = process.env.REACT_APP_API_URL;

const SERVICES = {
  cleaning: {
    name: "Dọn Dẹp Tổng Quát",
    price: 70000,
    icon: "🧽",
    minHours: 1,
  },
  cooking: {
    name: "Nấu Ăn & Rửa Bát",
    price: 90000,
    icon: "👩‍🍳",
    minHours: 1,
  },
  laundry: { name: "Giặt Ủi Quần Áo", price: 70000, icon: "👕", minHours: 1 },
  childcare: {
    name: "Chăm Sóc Trẻ Em",
    price: 100000,
    icon: "👶",
    minHours: 1,
  },
};

const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const TODAY_STR = toDateStr(new Date());

function ProgressSteps({ currentStep = 1 }) {
  const steps = [
    { id: 1, name: "Chọn dịch vụ" },
    { id: 2, name: "Chọn thời gian" },
    { id: 3, name: "Thông tin" },
    { id: 4, name: "Xác nhận" },
  ];
  const dotClass = (id) => {
    if (id < currentStep) return "bg-emerald-500 text-white";
    if (id === currentStep)
      return "bg-gradient-to-br from-emerald-600 to-amber-500 text-white shadow";
    return "bg-slate-200 text-slate-500";
  };
  const textClass = (id) =>
    id <= currentStep ? "text-emerald-700" : "text-slate-500";

  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${dotClass(
                    step.id
                  )}`}
                >
                  {step.id}
                </div>
                <span
                  className={`hidden sm:block text-sm font-medium ${textClass(
                    step.id
                  )}`}
                >
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-slate-200 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Step 1: Chọn dịch vụ
========================= */
function ServiceCard({ k, data, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(k)}
      className={`text-left rounded-2xl border-2 transition-all p-5 bg-white shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600
        ${
          selected
            ? "border-transparent ring-2 ring-offset-2 ring-emerald-600 bg-gradient-to-br from-emerald-50 to-amber-50"
            : "border-transparent hover:border-emerald-200"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-emerald-50">
          {data.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            {data.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {k === "cleaning" &&
              "Vệ sinh toàn bộ nhà cửa, lau chùi, hút bụi, sắp xếp đồ đạc"}
            {k === "cooking" &&
              "Chuẩn bị bữa ăn theo yêu cầu, rửa bát đĩa, dọn dẹp bếp"}
            {k === "laundry" &&
              "Giặt giũ, phơi khô, ủi là và sắp xếp quần áo gọn gàng"}
            {k === "childcare" &&
              "Trông trẻ, cho ăn, vui chơi và các hoạt động phù hợp"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              {data.price.toLocaleString("vi-VN")}đ/giờ
            </span>
            <span
              className="text-xs sm:text-sm inline-flex items-center gap-1 px-2 py-1 rounded-full
                             bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              Tối thiểu {data.minHours} giờ
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function StepService({ selected, setSelected, onNext }) {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Chọn dịch vụ
        </h1>
        <p className="text-gray-600">
          Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(SERVICES).map(([k, v]) => (
          <ServiceCard
            key={k}
            k={k}
            data={v}
            selected={selected === k}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <button
          onClick={onNext}
          disabled={!selected}
          className="inline-flex items-center justify-center rounded-xl px-8 py-3 font-semibold text-white shadow transition
                     disabled:cursor-not-allowed disabled:opacity-50
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}

/* =========================
   Step 2: Chọn thời gian
========================= */
function Calendar({ selectedDate, onDateSelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=CN
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const arr = [];

    for (let i = 0; i < firstDay; i++) arr.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = toDateStr(dateObj);
      const isToday = dateStr === TODAY_STR;
      const isPast =
        dateObj <
        new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSelected = selectedDate === dateStr;
      arr.push({ d, dateStr, isToday, isPast, isSelected });
    }

    const rem = arr.length % 7;
    if (rem) for (let i = 0; i < 7 - rem; i++) arr.push(null);

    return arr;
  }, [currentMonth, currentYear, selectedDate]);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn ngày</h3>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Tháng trước"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 className="text-lg font-semibold">
          {monthNames[currentMonth]}, {currentYear}
        </h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Tháng sau"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((w) => (
          <div
            key={w}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((cell, idx) => {
          if (!cell) return <div key={`e-${idx}`} />;
          const { d, dateStr, isToday, isPast, isSelected } = cell;

          const base = "p-3 text-center rounded-lg transition-all select-none";
          const state = isPast
            ? "text-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-gradient-to-br from-emerald-600 to-amber-500 text-white shadow cursor-pointer"
            : isToday
            ? "ring-2 ring-amber-400 text-emerald-700 cursor-pointer"
            : "hover:bg-gray-100 cursor-pointer";

          return (
            <div
              key={dateStr}
              className={`${base} ${state}`}
              onClick={!isPast ? () => onDateSelect(dateStr) : undefined}
              title={dateStr}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeAndDuration({
  service,
  duration,
  setDuration,
  selectedDate,
  selectedTime,
  setSelectedTime,
  totalPrice,
}) {
  const minHours = service?.minHours ?? 2;

  const minTime = useMemo(() => {
    if (!selectedDate) return "00:00";
    if (selectedDate !== TODAY_STR) return "00:00";
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [selectedDate]);

  const adjust = (delta) => {
    const v = Number((duration + delta).toFixed(1));
    if (v >= minHours && v <= 8) setDuration(v);
  };

  const isTimeValid = useMemo(() => {
    if (!selectedDate || !selectedTime) return false;
    if (selectedDate !== TODAY_STR) return true;
    const [hh, mm] = selectedTime.split(":").map(Number);
    const chosen = new Date(
      `${selectedDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(
        2,
        "0"
      )}:00`
    );
    return chosen.getTime() >= Date.now();
  }, [selectedDate, selectedTime]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chọn giờ & thời lượng
      </h3>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Giờ bắt đầu
      </label>
      <input
        type="time"
        step={60}
        min={minTime}
        max="23:59"
        value={selectedTime || ""}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <p className="mt-2 text-xs text-gray-500">
        Bạn có thể chọn bất kỳ thời điểm nào trong ngày (độ phân giải 1 phút).
      </p>

      {!isTimeValid && selectedTime && selectedDate === TODAY_STR && (
        <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Giờ bạn chọn đã qua so với thời điểm hiện tại. Vui lòng chọn giờ lớn
          hơn.
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Thời gian làm việc</h4>
        <div className="flex items-center gap-4">
          <button
            onClick={() => adjust(-0.5)}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              {duration.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">
              giờ (tối thiểu {minHours} giờ)
            </div>
          </div>
          <button
            onClick={() => adjust(0.5)}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
          >
            +
          </button>
        </div>

        <div className="mt-3 text-center">
          <div className="text-lg font-semibold text-gray-900">
            Tổng tiền:{" "}
            <span className="text-emerald-600">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTime({
  service,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  duration,
  setDuration,
  onNext,
  onBack,
  totalPrice,
}) {
  const canNext =
    selectedDate &&
    selectedTime &&
    (selectedDate !== TODAY_STR ||
      (() => {
        const [hh, mm] = selectedTime.split(":").map(Number);
        const chosen = new Date(
          `${selectedDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(
            2,
            "0"
          )}:00`
        );
        return chosen.getTime() >= Date.now();
      })());

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Chọn thời gian
        </h1>
        <p className="text-gray-600">
          Lựa chọn ngày & giờ phù hợp với lịch trình của bạn
        </p>
        {service && (
          <div className="mt-3 text-sm text-gray-600">
            Dịch vụ: <span className="font-semibold">{service.name}</span> •
            Giá: {service.price.toLocaleString("vi-VN")}đ/giờ • Tối thiểu{" "}
            {service.minHours}h
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <TimeAndDuration
          service={service}
          duration={duration}
          setDuration={setDuration}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          totalPrice={totalPrice}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="px-8 py-3 rounded-lg font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-50
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}

/* =========================
   Step 3: Thông tin khách hàng
========================= */
function StepCustomer({
  customerInfo,
  setCustomerInfo,
  onNext,
  onBack,
  pricing,
}) {
  const handleInputChange = (field, value) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
  };

  const validateAndNext = () => {
    const { name, phone, address } = customerInfo;
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert(
        "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ)"
      );
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Thông tin khách hàng
        </h2>
        <p className="text-gray-600">
          Vui lòng cung cấp thông tin để chúng tôi liên lạc và cung cấp dịch vụ
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Nhập địa chỉ email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ *
              </label>
              <textarea
                rows={3}
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú đặc biệt
              </label>
              <textarea
                rows={3}
                value={customerInfo.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Yêu cầu đặc biệt, hướng dẫn đến địa chỉ, lưu ý về thú cưng..."
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-900 mb-2">
                Phương thức thanh toán
              </h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={customerInfo.paymentMethod === "cash"}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className="accent-emerald-600"
                  />
                  <span className="ml-2 text-emerald-800">
                    💰 Thanh toán tiền mặt
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={customerInfo.paymentMethod === "online"}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className="accent-emerald-600"
                  />
                  <span className="ml-2 text-emerald-800">
                    💳 Thanh toán online{" "}
                    <span className="font-semibold">(Giảm 5%)</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-xl shadow-sm p-6 h-max">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tóm tắt đơn hàng
          </h3>
          <div className="space-y-3 text-sm">
            <Row label="Dịch vụ" value={pricing.serviceName} />
            <Row label="Ngày" value={pricing.date} />
            <Row label="Giờ bắt đầu" value={pricing.time} />
            <Row label="Thời lượng" value={`${pricing.duration} giờ`} />
            <Row
              label="Tạm tính"
              value={`${pricing.subtotal.toLocaleString("vi-VN")}đ`}
            />
            {pricing.discount > 0 && (
              <Row
                label="Giảm giá (5% online)"
                value={`- ${pricing.discount.toLocaleString("vi-VN")}đ`}
                className="text-emerald-700"
              />
            )}
            <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Tổng cộng</span>
              <span className="text-lg font-bold text-emerald-600">
                {pricing.total.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={validateAndNext}
          className="px-8 py-3 rounded-lg font-semibold text-white shadow
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </button>
      </div>
    </>
  );
}

function Row({ label, value, className = "" }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

/* =========================
   Step 4: Xác nhận
========================= */
function formatDateVN(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StepConfirm({
  service,
  date,
  time,
  duration,
  customer,
  pricing,
  onBack,
  onConfirm,
}) {
  if (!service || !customer) return null;
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Xác nhận đặt lịch
        </h1>
        <p className="text-gray-600">
          Vui lòng kiểm tra lại thông tin trước khi xác nhận
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-8">
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin dịch vụ
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-xl">
                  {service.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-emerald-600">
                    {service.price.toLocaleString("vi-VN")}đ/giờ
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  Ngày:{" "}
                  <span className="font-medium text-gray-900">
                    {formatDateVN(date)}
                  </span>
                </div>
                <div>
                  Giờ: <span className="font-medium text-gray-900">{time}</span>
                </div>
                <div>
                  Thời lượng:{" "}
                  <span className="font-medium text-gray-900">
                    {duration} giờ
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin khách hàng
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div>
                  Họ tên:{" "}
                  <span className="font-medium text-gray-900">
                    {customer.name}
                  </span>
                </div>
                <div>
                  Điện thoại:{" "}
                  <span className="font-medium text-gray-900">
                    {customer.phone}
                  </span>
                </div>
                <div>
                  Email:{" "}
                  <span className="font-medium text-gray-900">
                    {customer.email || "Không có"}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  Địa chỉ:{" "}
                  <span className="font-medium text-gray-900">
                    {customer.address}
                  </span>
                </div>
                <div>
                  Thanh toán:{" "}
                  <span className="font-medium text-gray-900">
                    {customer.paymentMethod === "cash"
                      ? "Tiền mặt"
                      : "Thanh toán online (giảm 5%)"}
                  </span>
                </div>
                {customer.notes?.trim() && (
                  <div>
                    Ghi chú:{" "}
                    <span className="font-medium text-gray-900">
                      {customer.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chi tiết thanh toán
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {pricing.subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-700">
                    Giảm giá (5% online):
                  </span>
                  <span className="font-medium text-emerald-700">
                    -{pricing.discount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {pricing.total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex justify-between">
            <button
              onClick={onBack}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={onConfirm}
              className="px-8 py-3 rounded-lg font-semibold text-white shadow
                         bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   Success (hiện sau khi xác nhận, không tính bước)
========================= */
function Success({ code, onNew, onHome }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Đặt lịch thành công!
        </h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã tin tưởng CleanMate. Chúng tôi sẽ liên hệ trong thời
          gian sớm nhất để xác nhận chi tiết.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-emerald-900 mb-2">
            Mã đặt lịch của bạn:
          </h3>
          <div className="text-2xl font-bold text-emerald-700">{code}</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNew}
            className="w-full px-8 py-3 rounded-lg font-semibold text-white shadow
                       bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
          >
            Đặt lịch mới
          </button>
          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN: Booking (4 bước)
========================= */
export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const service = selectedKey ? SERVICES[selectedKey] : null;

  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(service?.minHours ?? 2);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  });

  const subtotal = useMemo(
    () => (service ? service.price * duration : 0),
    [service, duration]
  );
  const discount = useMemo(
    () =>
      customerInfo.paymentMethod === "online" ? Math.round(subtotal * 0.05) : 0,
    [customerInfo.paymentMethod, subtotal]
  );
  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount]
  );

  const [successCode, setSuccessCode] = useState("");

  const goNext = () => setCurrentStep((s) => Math.min(4, s + 1));
  const goBack = () => setCurrentStep((s) => Math.max(1, s - 1));

  const onServiceNext = () => {
    if (!selectedKey) return;
    // bảo đảm duration tối thiểu theo service
    setDuration(SERVICES[selectedKey].minHours);
    goNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onTimeNext = () => {
    // validate ở StepTime đã disable nút; vẫn phòng hờ:
    if (!selectedDate || !selectedTime) return;
    goNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCustomerNext = () => {
    const { name, phone, address } = customerInfo;
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    goNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onConfirm = async () => {
    // debug: kiểm tra token hiện có
    console.log("Token when booking:", localStorage.getItem("cm_token"));

    try {
      const res = await createBooking({
        CleanerId: 1,
        // gửi ISO thật sự để .NET parse an toàn
        StartTime: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
        DurationHours: duration,
        Price: total,
        Address: customerInfo.address,
        Notes: customerInfo.notes,
        PaymentMethod: customerInfo.paymentMethod,
      });

      setSuccessCode("CM" + String(res.id).padStart(6, "0"));
      setCurrentStep(99);
    } catch (err) {
      console.error("createBooking error:", {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert(err?.response?.data || "Đặt lịch thất bại");
    }
  };

  const resetAll = () => {
    setCurrentStep(1);
    setSelectedKey(null);
    setSelectedDate(TODAY_STR);
    setSelectedTime("");
    setDuration(2);
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      paymentMethod: "cash",
    });
    setSuccessCode("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pricingSummary = {
    serviceName: service?.name || "",
    date: selectedDate,
    time: selectedTime,
    duration,
    subtotal,
    discount,
    total,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {currentStep >= 1 && currentStep <= 4 && (
        <ProgressSteps currentStep={currentStep} />
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {currentStep === 1 && (
          <StepService
            selected={selectedKey}
            setSelected={setSelectedKey}
            onNext={onServiceNext}
          />
        )}

        {currentStep === 2 && (
          <StepTime
            service={service}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            duration={duration}
            setDuration={setDuration}
            totalPrice={subtotal}
            onNext={onTimeNext}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <StepCustomer
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            pricing={pricingSummary}
            onNext={onCustomerNext}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <StepConfirm
            service={service}
            date={selectedDate}
            time={selectedTime}
            duration={duration}
            customer={customerInfo}
            pricing={pricingSummary}
            onBack={goBack}
            onConfirm={onConfirm}
          />
        )}

        {currentStep === 99 && (
          <Success
            code={successCode}
            onNew={resetAll}
            onHome={() => {
              /* Link trong component */
            }}
          />
        )}
      </main>
    </div>
  );
}
