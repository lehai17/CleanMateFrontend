import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentQR() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || {};
  const amount = booking.price || 0;

  const handlePaid = () => {
    navigate("/booking", {
      state: { goToStep: 4, booking },
    });
  };

  const handleBack = () => {
    const fromStep = location.state?.fromStep;
    const booking = location.state?.booking;

    if (fromStep === 3 && booking) {
      navigate("/booking", {
        state: { goToStep: 3, booking },
      });
    } else {
      navigate(-1); // fallback
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">
        Thanh toán online
      </h1>

      <p className="text-gray-600 mb-4">
        Quét mã QR bằng ứng dụng <b>MoMo</b> hoặc ngân hàng để thanh toán
      </p>

      <img
        src="/images/QR.png"
        alt="QR Thanh toán"
        className="w-72 h-72 shadow-lg rounded-xl border border-gray-200 mb-6"
      />

      <div className="text-lg text-gray-700 mb-6">
        <b>Số tiền:</b>{" "}
        <span className="text-emerald-600 font-semibold">
          {amount.toLocaleString("vi-VN")}đ
        </span>
      </div>

      <div className="text-center text-sm text-gray-500 mb-8">
        Dịch vụ: <b>{booking.serviceName}</b> • <span>Ngày {booking.date}</span>{" "}
        • <span>{booking.duration} giờ</span>
      </div>

      <div className="flex flex-col gap-3 w-64">
        <button
          onClick={handlePaid}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          ✅ Đã thanh toán
        </button>

        <button
          onClick={handleBack}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          🔙 Quay lại chỉnh sửa
        </button>
      </div>
    </div>
  );
}
