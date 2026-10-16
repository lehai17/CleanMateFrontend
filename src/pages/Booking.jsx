import { Ui, Raw, t } from './../ui/Preferences';
import React, { useMemo, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from './../ui/Links';
import { createBooking } from "../api/bookings";
import { useAuth } from "../context/AuthContext";
import { phoneLink } from "../utils/contact";
import { newRequestId } from "../utils/requestId";
import { getServices } from "../api/services";
import { rebookingDraft, rebookingNotice } from "../utils/rebooking";

/* =========================
   Data & Helpers
========================= */
const API_URL = process.env.REACT_APP_API_URL;

const SERVICE_PRESENTATION = {
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
    <Ui as="div" className="bg-white border-b">
      <Ui as="div" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Ui as="div" className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <Ui as="div" className="flex items-center gap-3">
                <Ui as="div"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${dotClass(
                    step.id
                  )}`}
                >
                  {step.id}
                </Ui>
                <Ui as="span"
                  className={`hidden sm:block text-sm font-medium ${textClass(
                    step.id
                  )}`}
                >
                  {step.name}
                </Ui>
              </Ui>
              {idx < steps.length - 1 && (
                <Ui as="div" className="flex-1 h-px bg-slate-200 mx-4" />
              )}
            </React.Fragment>
          ))}
        </Ui>
      </Ui>
    </Ui>
  );
}

/* =========================
   Step 1: Chọn dịch vụ
========================= */
function ServiceCard({ k, data, selected, onSelect }) {
  return (
    <Ui as="button"
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
      <Ui as="div" className="flex items-start gap-4">
        <Ui as="div" className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-emerald-50">
          {data.icon}
        </Ui>
        <Ui as="div" className="flex-1">
          <Ui as="h3" className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            {data.name}
          </Ui>
          <Ui as="p" className="text-sm text-gray-600 mb-3">
            {k === "cleaning" &&
              "Vệ sinh toàn bộ nhà cửa, lau chùi, hút bụi, sắp xếp đồ đạc"}
            {k === "cooking" &&
              "Chuẩn bị bữa ăn theo yêu cầu, rửa bát đĩa, dọn dẹp bếp"}
            {k === "laundry" &&
              "Giặt giũ, phơi khô, ủi là và sắp xếp quần áo gọn gàng"}
            {k === "childcare" &&
              "Trông trẻ, cho ăn, vui chơi và các hoạt động phù hợp"}
          </Ui>
          <Ui as="div" className="flex items-center justify-between">
            <Ui as="span" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              {data.price.toLocaleString("vi-VN")}đ/giờ
            </Ui>
            <Ui as="span"
              className="text-xs sm:text-sm inline-flex items-center gap-1 px-2 py-1 rounded-full
                             bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              Tối thiểu {data.minHours} giờ
            </Ui>
          </Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}

function StepService({ selected, setSelected, onNext, services }) {
  return (
    <>
      <Ui as="div" className="text-center mb-8">
        <Ui as="h1" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Chọn dịch vụ
        </Ui>
        <Ui as="p" className="text-gray-600">
          Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
        </Ui>
      </Ui>

      <Ui as="div" className="grid md:grid-cols-2 gap-6">
        {Object.entries(services).map(([k, v]) => (
          <ServiceCard
            key={k}
            k={k}
            data={v}
            selected={selected === k}
            onSelect={setSelected}
          />
        ))}
      </Ui>

      <Ui as="div" className="mt-8 flex items-center justify-center">
        <Ui as="button"
          onClick={onNext}
          disabled={!selected}
          className="inline-flex items-center justify-center rounded-xl px-8 py-3 font-semibold text-white shadow transition
                     disabled:cursor-not-allowed disabled:opacity-50
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </Ui>
      </Ui>
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
    <Ui as="div" className="bg-white rounded-xl shadow-sm p-6">
      <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">Chọn ngày</Ui>

      <Ui as="div" className="flex items-center justify-between mb-4">
        <Ui as="button"
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
        </Ui>
        <Ui as="h4" className="text-lg font-semibold">
          {monthNames[currentMonth]}, {currentYear}
        </Ui>
        <Ui as="button"
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
        </Ui>
      </Ui>

      <Ui as="div" className="grid grid-cols-7 gap-1 mb-2">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((w) => (
          <Ui as="div"
            key={w}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {w}
          </Ui>
        ))}
      </Ui>

      <Ui as="div" className="grid grid-cols-7 gap-1">
        {days.map((cell, idx) => {
          if (!cell) return <Ui as="div" key={`e-${idx}`} />;
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
            <Ui as="div"
              key={dateStr}
              className={`${base} ${state}`}
              onClick={!isPast ? () => onDateSelect(dateStr) : undefined}
              title={dateStr}
            >
              {d}
            </Ui>
          );
        })}
      </Ui>
    </Ui>
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
  const MIN_HOURS = service?.minHours ?? 1; // vẫn lấy min theo service
  const MAX_HOURS = service?.maxHours ?? 8;

  // ⬇️ giữ nguyên block minTime
  const minTime = useMemo(() => {
    if (!selectedDate) return "00:00";
    if (selectedDate !== TODAY_STR) return "00:00";
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }, [selectedDate]);

  // ✅ CHỈ NHẢY 1 GIỜ & LUÔN LÀ SỐ NGUYÊN
  const adjust = (delta) => {
    const cur = Number.isInteger(duration)
      ? duration
      : Math.round(Number(duration) || MIN_HOURS);
    const next = Math.max(MIN_HOURS, Math.min(MAX_HOURS, cur + delta)); // clamp [min, max]
    setDuration(next);
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
    <Ui as="div" className="bg-white rounded-xl shadow-sm p-6">
      <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">
        Chọn giờ & thời lượng
      </Ui>

      <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
        Giờ bắt đầu
      </Ui>
      <Ui as="input"
        type="time"
        step={60}
        min={minTime}
        max="23:59"
        value={selectedTime || ""}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <Ui as="p" className="mt-2 text-xs text-gray-500">
        Bạn có thể chọn bất kỳ thời điểm nào trong ngày (độ phân giải 1 phút).
      </Ui>

      {!isTimeValid && selectedTime && selectedDate === TODAY_STR && (
        <Ui as="div" className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Giờ bạn chọn đã qua so với thời điểm hiện tại. Vui lòng chọn giờ lớn
          hơn.
        </Ui>
      )}

      <Ui as="div" className="mt-6">
        <Ui as="h4" className="font-medium text-gray-900 mb-3">Thời gian làm việc</Ui>
        <Ui as="div" className="flex items-center gap-4">
          <Ui as="button"
            onClick={() => adjust(-1)} // ⬅️ trừ 1 giờ
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
          >
            -
          </Ui>
          <Ui as="div" className="flex-1 text-center">
            <Ui as="div" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
              {Number.isInteger(duration)
                ? duration
                : Math.round(Number(duration) || MIN_HOURS)}
            </Ui>
            <Ui as="div" className="text-sm text-gray-500">
              giờ (tối thiểu {MIN_HOURS} giờ)
            </Ui>
          </Ui>
          <Ui as="button"
            onClick={() => adjust(1)} // ⬅️ cộng 1 giờ
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
          >
            +
          </Ui>
        </Ui>

        <Ui as="div" className="mt-3 text-center">
          <Ui as="div" className="text-lg font-semibold text-gray-900">
            Tổng tiền:{" "}
            <Ui as="span" className="text-emerald-600">
              {totalPrice.toLocaleString("vi-VN")}đ
            </Ui>
          </Ui>
        </Ui>
      </Ui>
    </Ui>
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
      <Ui as="div" className="text-center mb-8">
        <Ui as="h1" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Chọn thời gian
        </Ui>
        <Ui as="p" className="text-gray-600">
          Lựa chọn ngày & giờ phù hợp với lịch trình của bạn
        </Ui>
        {service && (
          <Ui as="div" className="mt-3 text-sm text-gray-600">
            Dịch vụ: <Ui as="span" className="font-semibold">{service.name}</Ui> •
            Giá: {service.price.toLocaleString("vi-VN")}đ/giờ • Tối thiểu{" "}
            {service.minHours}h
          </Ui>
        )}
      </Ui>

      <Ui as="div" className="grid lg:grid-cols-2 gap-8">
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
      </Ui>

      <Ui as="div" className="mt-8 flex justify-between">
        <Ui as="button"
          onClick={onBack}
          className="px-8 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Quay lại
        </Ui>
        <Ui as="button"
          onClick={onNext}
          disabled={!canNext}
          className="px-8 py-3 rounded-lg font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-50
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </Ui>
      </Ui>
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
        t("Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ)")
      );
      return;
    }
    if (!phoneLink(phone) || phone.length > 40) {
      alert(t("Số điện thoại liên hệ không hợp lệ (6 đến 15 chữ số)."));
      return;
    }
    onNext();
  };

  return (
    <>
      <Ui as="div" className="text-center mb-8">
        <Ui as="h2" className="text-3xl font-bold text-gray-900 mb-2">
          Thông tin khách hàng
        </Ui>
        <Ui as="p" className="text-gray-600">
          Vui lòng cung cấp thông tin để chúng tôi liên lạc và cung cấp dịch vụ
        </Ui>
      </Ui>

      <Ui as="div" className="grid lg:grid-cols-3 gap-8">
        <Ui as="div" className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
          <Ui as="div" className="space-y-6">
            <Ui as="div" className="grid md:grid-cols-2 gap-6">
              <Ui as="div">
                <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </Ui>
                <Ui as="input"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="Nhập họ và tên"
                />
              </Ui>
              <Ui as="div">
                <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </Ui>
                <Ui as="input"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  placeholder="Nhập số điện thoại"
                />
              </Ui>
            </Ui>

            <Ui as="div">
              <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Ui>
              <Ui as="input"
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Nhập địa chỉ email"
              />
            </Ui>

            <Ui as="div">
              <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ *
              </Ui>
              <Ui as="textarea"
                rows={3}
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện)"
              />
            </Ui>

            <Ui as="div">
              <Ui as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú đặc biệt
              </Ui>
              <Ui as="textarea"
                rows={3}
                value={customerInfo.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder="Yêu cầu đặc biệt, hướng dẫn đến địa chỉ, lưu ý về thú cưng..."
              />
            </Ui>

            <Ui as="div" className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <Ui as="h4" className="font-medium text-emerald-900 mb-2">
                Phương thức thanh toán
              </Ui>
              <Ui as="div" className="space-y-2">
                <Ui as="label" className="flex items-center cursor-pointer">
                  <Ui as="input"
                    type="radio"
                    name="payment"
                    value="cash"
                    checked
                    readOnly
                    className="accent-emerald-600"
                  />
                  <Ui as="span" className="ml-2 text-emerald-800">
                    Tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca
                  </Ui>
                </Ui>
                <Ui as="p" className="text-sm text-emerald-800">CleanMate chỉ kết nối dịch vụ, không thu hoặc giữ tiền.</Ui>
              </Ui>
            </Ui>
          </Ui>
        </Ui>

        <Ui as="aside" className="bg-white rounded-xl shadow-sm p-6 h-max">
          <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">
            Tóm tắt đơn hàng
          </Ui>
          <Ui as="div" className="space-y-3 text-sm">
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
                label="Giảm giá"
                value={`- ${pricing.discount.toLocaleString("vi-VN")}đ`}
                className="text-emerald-700"
              />
            )}
            <Ui as="div" className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
              <Ui as="span" className="font-semibold text-gray-900">Tổng cộng</Ui>
              <Ui as="span" className="text-lg font-bold text-emerald-600">
                {pricing.total.toLocaleString("vi-VN")}đ
              </Ui>
            </Ui>
          </Ui>
        </Ui>
      </Ui>

      <Ui as="div" className="mt-8 flex justify-between">
        <Ui as="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Quay lại
        </Ui>
        <Ui as="button"
          onClick={validateAndNext}
          className="px-8 py-3 rounded-lg font-semibold text-white shadow
                     bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          Tiếp tục
        </Ui>
      </Ui>
    </>
  );
}

function Row({ label, value, className = "" }) {
  return (
    <Ui as="div" className={`flex items-center justify-between ${className}`}>
      <Ui as="span" className="text-gray-600">{label}</Ui>
      <Ui as="span" className="text-gray-900 font-medium">{value}</Ui>
    </Ui>
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
  submitting,
}) {
  if (!service || !customer) return null;
  return (
    <>
      <Ui as="div" className="text-center mb-8">
        <Ui as="h1" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Xác nhận đặt lịch
        </Ui>
        <Ui as="p" className="text-gray-600">
          Vui lòng kiểm tra lại thông tin trước khi xác nhận
        </Ui>
      </Ui>

      <Ui as="div" className="bg-white rounded-xl shadow-sm p-8">
        <Ui as="div" className="space-y-8">
          <Ui as="section" className="border-b pb-6">
            <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin dịch vụ
            </Ui>
            <Ui as="div" className="grid md:grid-cols-2 gap-6">
              <Ui as="div" className="flex items-center gap-3">
                <Ui as="div" className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-xl">
                  {service.icon}
                </Ui>
                <Ui as="div">
                  <Ui as="div" className="font-medium text-gray-900">
                    {service.name}
                  </Ui>
                  <Ui as="div" className="text-emerald-600">
                    {service.price.toLocaleString("vi-VN")}đ/giờ
                  </Ui>
                </Ui>
              </Ui>
              <Ui as="div" className="text-sm text-gray-600 space-y-1">
                <Ui as="div">
                  Ngày:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {formatDateVN(date)}
                  </Ui>
                </Ui>
                <Ui as="div">
                  Giờ: <Ui as="span" className="font-medium text-gray-900">{time}</Ui>
                </Ui>
                <Ui as="div">
                  Thời lượng:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {duration} giờ
                  </Ui>
                </Ui>
              </Ui>
            </Ui>
          </Ui>

          <Ui as="section" className="border-b pb-6">
            <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin khách hàng
            </Ui>
            <Ui as="div" className="grid md:grid-cols-2 gap-6">
              <Ui as="div" className="space-y-2 text-sm">
                <Ui as="div">
                  Họ tên:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {<Raw>{customer.name}</Raw>}
                  </Ui>
                </Ui>
                <Ui as="div">
                  Điện thoại:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {<Raw>{customer.phone}</Raw>}
                  </Ui>
                </Ui>
                <Ui as="div">
                  Email:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {<Raw>{customer.email || "Không có"}</Raw>}
                  </Ui>
                </Ui>
              </Ui>
              <Ui as="div" className="space-y-2 text-sm">
                <Ui as="div">
                  Địa chỉ:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    {<Raw>{customer.address}</Raw>}
                  </Ui>
                </Ui>
                <Ui as="div">
                  Thanh toán:{" "}
                  <Ui as="span" className="font-medium text-gray-900">
                    Tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca
                  </Ui>
                </Ui>
                {customer.notes?.trim() && (
                  <Ui as="div">
                    Ghi chú:{" "}
                    <Ui as="span" className="font-medium text-gray-900">
                      {<Raw>{customer.notes}</Raw>}
                    </Ui>
                  </Ui>
                )}
              </Ui>
            </Ui>
          </Ui>

          <Ui as="section">
            <Ui as="h3" className="text-lg font-semibold text-gray-900 mb-4">
              Chi tiết thanh toán
            </Ui>
            <Ui as="div" className="bg-gray-50 p-4 rounded-lg">
              <Ui as="div" className="flex justify-between items-center mb-2">
                <Ui as="span" className="text-gray-600">Tạm tính:</Ui>
                <Ui as="span" className="font-medium">
                  {pricing.subtotal.toLocaleString("vi-VN")}đ
                </Ui>
              </Ui>
              {pricing.discount > 0 && (
                <Ui as="div" className="flex justify-between items-center mb-2">
                  <Ui as="span" className="text-emerald-700">
                    Giảm giá:
                  </Ui>
                  <Ui as="span" className="font-medium text-emerald-700">
                    -{pricing.discount.toLocaleString("vi-VN")}đ
                  </Ui>
                </Ui>
              )}
              <Ui as="div" className="border-t pt-2 mt-2">
                <Ui as="div" className="flex justify-between items-center">
                  <Ui as="span" className="text-lg font-semibold text-gray-900">
                    Tổng cộng:
                  </Ui>
                  <Ui as="span" className="text-2xl font-bold text-emerald-600">
                    {pricing.total.toLocaleString("vi-VN")}đ
                  </Ui>
                </Ui>
              </Ui>
            </Ui>
          </Ui>

          <Ui as="div" className="mt-8 flex justify-between">
            <Ui as="button"
              onClick={onBack}
              disabled={submitting}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </Ui>
            <Ui as="button"
              onClick={onConfirm}
              disabled={submitting}
              className="px-8 py-3 rounded-lg font-semibold text-white shadow
                         bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
            >
              {submitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
            </Ui>
          </Ui>
        </Ui>
      </Ui>
    </>
  );
}

/* =========================
   Success (hiện sau khi xác nhận, không tính bước)
========================= */
function Success({ code, onNew, onHome }) {
  return (
    <Ui as="div" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Ui as="div" className="bg-white rounded-xl shadow-sm p-10 text-center">
        <Ui as="div" className="text-6xl mb-6">✅</Ui>
        <Ui as="h1" className="text-3xl font-bold text-gray-900 mb-3">
          Đặt lịch thành công!
        </Ui>
        <Ui as="p" className="text-gray-600 mb-8">
          Cảm ơn bạn đã tin tưởng CleanMate. Chúng tôi sẽ liên hệ trong thời
          gian sớm nhất để xác nhận chi tiết.
        </Ui>

        <Ui as="div" className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg mb-8">
          <Ui as="h3" className="font-semibold text-emerald-900 mb-2">
            Mã đặt lịch của bạn:
          </Ui>
          <Ui as="div" className="text-2xl font-bold text-emerald-700">{code}</Ui>
        </Ui>

        <Ui as="div" className="space-y-3">
          <Ui as="button"
            onClick={onNew}
            className="w-full px-8 py-3 rounded-lg font-semibold text-white shadow
                       bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
          >
            Đặt lịch mới
          </Ui>
          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Về trang chủ
          </Link>
        </Ui>
      </Ui>
    </Ui>
  );
}

/* =========================
   MAIN: Booking (4 bước)
========================= */
export default function Booking() {
  const location = useLocation();
  const { user } = useAuth();
  const [services, setServices] = useState(null);
  const [error, setError] = useState("");
  const catalogRequest = useRef(0);
  const load = React.useCallback(() => { const request = ++catalogRequest.current; setServices(null); setError(""); getServices().then(data => {
    if (request !== catalogRequest.current) return;
    setServices(Object.fromEntries(data.map(s => [s.key, {
    ...SERVICE_PRESENTATION[s.key], name: s.name, price: s.hourlyRate, minHours: s.minHours, maxHours: s.maxHours,
  }]))); }).catch(() => { if (request === catalogRequest.current) setError("Không thể tải dịch vụ và giá. Vui lòng thử lại."); }); }, []);
  React.useEffect(() => { load(); return () => { catalogRequest.current++; }; }, [load, location.state?.rebookKey, user?.id]);
  if (error) return <Ui as="main" className="p-8"><Ui as="p" role="alert">{error}</Ui><Ui as="button" onClick={load}>Thử lại</Ui></Ui>;
  if (!services) return <Ui as="main" className="p-8">Đang tải dịch vụ...</Ui>;
  if (!Object.keys(services).length) return <Ui as="main" className="p-8">Hiện chưa có dịch vụ mở đặt lịch.</Ui>;
  return <BookingFlow key={`${user?.id}:${location.state?.rebookKey || 'new'}`} services={services}
    rebook={rebookingDraft(location.state?.rebook, services, user)} />;
}

function BookingFlow({ services: SERVICES, rebook }) {
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(rebook?.selectedKey ? 2 : 1);
  const [rebookMessage, setRebookMessage] = useState(rebookingNotice(rebook));

  const location = useLocation();
  React.useEffect(() => {
    if (location.state?.goToStep) {
      setCurrentStep(location.state.goToStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);
  React.useEffect(() => {
    const b = location.state?.booking;
    if (b) {
      // ✅ Gán lại dịch vụ, thời gian
      setSelectedKey(
        Object.keys(SERVICES).find((k) => SERVICES[k].name === b.serviceName)
      );
      setSelectedDate(b.date);
      setSelectedTime(b.time);
      setDuration(b.duration);

      // ✅ Gán lại toàn bộ thông tin khách hàng
      setCustomerInfo({
        name: b.name || "",
        phone: b.phone || "",
        email: b.email || "",
        address: b.address || "",
        notes: b.notes || "",
        paymentMethod: "cash",
      });
    }
  }, [location.state]);

  const [selectedKey, setSelectedKey] = useState(rebook?.selectedKey ?? null);
  const [submitting, setSubmitting] = useState(false);
  const sending = useRef(false);
  const bookingAttempt = useRef(null);
  const service = selectedKey ? SERVICES[selectedKey] : null;

  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(rebook?.duration ?? service?.minHours ?? 2);

  const [customerInfo, setCustomerInfo] = useState(rebook?.customerInfo ?? {
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "cash",
  });

  React.useEffect(() => {
    if (!user) return;

    setCustomerInfo((current) => ({
      ...current,
      name: current.name || user.fullName || "",
      phone: current.phone || user.phoneNumber || "",
      email: current.email || user.email || "",
      address: current.address || user.address || "",
    }));
  }, [user]);

  const subtotal = useMemo(
    () => (service ? service.price * duration : 0),
    [service, duration]
  );
  const discount = 0;
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

  // const onCustomerNext = () => {
  //   const { name, phone, address } = customerInfo;
  //   if (!name.trim() || !phone.trim() || !address.trim()) return;
  //   goNext();
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  const onCustomerNext = () => {
    const { name, phone, address } = customerInfo;
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    goNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onConfirm = async () => {
    if (sending.current) return;
    sending.current = true;
    setSubmitting(true);
    try {
      const payload = {
        ServiceKey: selectedKey,
        // gửi ISO thật sự để .NET parse an toàn
        StartTime: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
        DurationHours: Number(duration),
        Address: customerInfo.address,
        ContactName: customerInfo.name,
        ContactPhone: customerInfo.phone,
        Notes: customerInfo.notes,
        PaymentMethod: "cash",
        ExpectedPrice: total,
      };
      const signature = JSON.stringify(payload);
      if (bookingAttempt.current?.signature !== signature)
        bookingAttempt.current = { signature, requestId: newRequestId() };
      const res = await createBooking({ ...payload, RequestId: bookingAttempt.current.requestId });

      setSuccessCode("CM" + String(res.id).padStart(6, "0"));
      setCurrentStep(99);
    } catch (err) {
      console.error("createBooking error:", {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert(t(err?.response?.data?.message || "Đặt lịch thất bại"));
    } finally { sending.current = false; setSubmitting(false); }
  };

  const resetAll = () => {
    setRebookMessage('');
    bookingAttempt.current = null;
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
    <Ui as="div" className="min-h-screen bg-gray-50 text-gray-800">
      {currentStep >= 1 && currentStep <= 4 && (
        <ProgressSteps currentStep={currentStep} />
      )}

      <Ui as="main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {rebookMessage && currentStep !== 99 && <Ui as="p" role="status" className="mb-6 rounded-xl bg-emerald-50 p-4 text-emerald-900">{rebookMessage}</Ui>}
        {currentStep === 1 && (
          <StepService
            services={SERVICES}
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
            submitting={submitting}
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
      </Ui>
    </Ui>
  );
}
