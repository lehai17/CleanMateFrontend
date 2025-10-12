// src/pages/Policies.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Policies() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "terms";
  const [active, setActive] = useState(defaultTab);
  const navigate = useNavigate();
  const contentTopRef = useRef(null);
  // const [active, setActive] = useState("terms"); // 'terms' | 'privacy' | 'service' | 'payment' | 'refund'

  useEffect(() => {
    document.title = "Điều khoản & Chính sách - CleanMate";
  }, []);

  const tabs = useMemo(
    () => [
      { id: "terms", label: "📋 Điều khoản sử dụng" },
      { id: "privacy", label: "🔒 Chính sách bảo mật" },
      { id: "service", label: "⚖️ Điều khoản dịch vụ" },
      { id: "payment", label: "💳 Chính sách thanh toán" },
      { id: "refund", label: "🔄 Chính sách hoàn tiền" },
    ],
    []
  );

  const setTab = (id) => {
    setActive(id);
    // scroll lên đầu vùng nội dung
    contentTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-amber-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Điều Khoản & Chính Sách
          </h1>
          <p className="text-xl text-emerald-50/90">
            Thông tin quan trọng về việc sử dụng dịch vụ CleanMate
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Mục lục</h3>
              <nav className="space-y-2">
                {tabs.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={[
                        "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        "hover:bg-gray-50 hover:translate-x-[2px]",
                        isActive
                          ? "bg-gradient-to-r from-emerald-600 to-amber-500 text-white shadow"
                          : "text-gray-700",
                      ].join(" ")}
                      id={`${t.id}-btn`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-3">
            <div ref={contentTopRef} />
            <div className="bg-white rounded-xl shadow-sm p-8">
              {active === "terms" && <TermsContent />}
              {active === "privacy" && <PrivacyContent />}
              {active === "service" && <ServiceContent />}
              {active === "payment" && <PaymentContent />}
              {active === "refund" && <RefundContent />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =================== Content Blocks =================== */

function TermsContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Điều Khoản Sử Dụng
      </h2>
      <p className="text-gray-600 mb-6">Cập nhật lần cuối: 19/09/2025</p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Chấp Nhận Điều Khoản
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bằng việc truy cập và sử dụng dịch vụ CleanMate, bạn đồng ý tuân thủ
            và bị ràng buộc bởi các điều khoản và điều kiện được nêu trong tài
            liệu này.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui
            lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. Mô Tả Dịch Vụ
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            CleanMate là nền tảng kết nối khách hàng với các nhân viên giúp việc
            chuyên nghiệp. Chúng tôi cung cấp:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Dịch vụ dọn dẹp nhà cửa theo giờ</li>
            <li>Dịch vụ nấu ăn và rửa bát</li>
            <li>Dịch vụ giặt ủi quần áo</li>
            <li>Dịch vụ chăm sóc trẻ em</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Đăng Ký Tài Khoản
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Để sử dụng dịch vụ, bạn cần tạo tài khoản với thông tin chính xác và
            đầy đủ. Bạn có trách nhiệm:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Bảo mật thông tin đăng nhập</li>
            <li>Thông báo ngay khi phát hiện tài khoản bị xâm phạm</li>
            <li>Cập nhật thông tin khi có thay đổi</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            4. Quyền và Nghĩa Vụ Của Khách Hàng
          </h3>
          <div className="bg-emerald-50 p-6 rounded-lg mb-4">
            <h4 className="font-semibold text-emerald-900 mb-2">
              Quyền của khách hàng:
            </h4>
            <ul className="list-disc list-inside text-emerald-800 space-y-1">
              <li>Nhận dịch vụ chất lượng theo đúng cam kết</li>
              <li>Được bảo vệ thông tin cá nhân</li>
              <li>Khiếu nại khi dịch vụ không đạt yêu cầu</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">
              Nghĩa vụ của khách hàng:
            </h4>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>Thanh toán đầy đủ và đúng hạn</li>
              <li>Cung cấp thông tin chính xác</li>
              <li>Tôn trọng nhân viên dịch vụ</li>
              <li>Tuân thủ các quy định an toàn</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            5. Giới Hạn Trách Nhiệm
          </h3>
          <p className="text-gray-700 leading-relaxed">
            CleanMate không chịu trách nhiệm về các thiệt hại gián tiếp, ngẫu
            nhiên hoặc hậu quả phát sinh từ việc sử dụng dịch vụ. Trách nhiệm
            của chúng tôi được giới hạn trong phạm vi giá trị dịch vụ đã thanh
            toán.
          </p>
        </section>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Chính Sách Bảo Mật
      </h2>
      <p className="text-gray-600 mb-6">Cập nhật lần cuối: 15/12/2024</p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Thông Tin Chúng Tôi Thu Thập
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-3">
                Thông tin cá nhân:
              </h4>
              <ul className="text-emerald-800 space-y-1 text-sm">
                <li>• Họ tên, số điện thoại</li>
                <li>• Địa chỉ email</li>
                <li>• Địa chỉ nhà</li>
                <li>• Thông tin thanh toán</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-3">
                Thông tin sử dụng:
              </h4>
              <ul className="text-amber-800 space-y-1 text-sm">
                <li>• Lịch sử đặt dịch vụ</li>
                <li>• Thời gian truy cập</li>
                <li>• Thiết bị sử dụng</li>
                <li>• Địa chỉ IP</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. Mục Đích Sử Dụng Thông Tin
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "Cung cấp dịch vụ",
                desc: "Xử lý đơn hàng, điều phối nhân viên, liên lạc với khách hàng",
              },
              {
                title: "Cải thiện chất lượng",
                desc: "Phân tích dữ liệu để nâng cao trải nghiệm người dùng",
              },
              {
                title: "Marketing",
                desc: "Gửi thông tin khuyến mãi (chỉ khi có sự đồng ý)",
              },
            ].map((i) => (
              <div className="flex items-start space-x-3" key={i.title}>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{i.title}</h4>
                  <p className="text-gray-600 text-sm">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Bảo Mật Thông Tin
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ thông tin của
              bạn:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Mã hóa SSL/TLS",
                "Tường lửa bảo mật",
                "Kiểm soát truy cập",
                "Giám sát 24/7",
              ].map((t) => (
                <div className="flex items-center space-x-2" key={t}>
                  <span className="text-emerald-600">🔐</span>
                  <span className="text-sm text-gray-700">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            4. Quyền Của Bạn
          </h3>
          <ul className="space-y-2">
            {[
              "Cung cấp thông tin cá nhân đang được lưu trữ",
              "Chỉnh sửa hoặc cập nhật thông tin",
              "Xóa thông tin cá nhân",
              "Từ chối nhận email marketing",
            ].map((t) => (
              <li className="flex items-center space-x-2" key={t}>
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                <span className="text-gray-700">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function ServiceContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Điều Khoản Dịch Vụ
      </h2>
      <p className="text-gray-600 mb-6">
        Quy định cụ thể về việc sử dụng dịch vụ CleanMate
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Quy Trình Đặt Dịch Vụ
          </h3>
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6">
            <ol className="list-decimal list-inside space-y-2 text-emerald-800">
              <li>Khách hàng đặt lịch qua website hoặc ứng dụng</li>
              <li>Xác nhận thông tin và thanh toán</li>
              <li>CleanMate điều phối nhân viên phù hợp</li>
              <li>Nhân viên thực hiện dịch vụ tại địa chỉ đã đăng ký</li>
              <li>Khách hàng đánh giá chất lượng dịch vụ</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. Thời Gian Dịch Vụ
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Giờ hoạt động:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Thứ 2 - Thứ 6: 7:00 - 22:00</li>
                <li>• Thứ 7 - Chủ nhật: 8:00 - 20:00</li>
                <li>• Lễ tết: Theo thông báo riêng</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Thời gian tối thiểu:
              </h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Dọn dẹp: 2 giờ</li>
                <li>• Nấu ăn: 1.5 giờ</li>
                <li>• Giặt ủi: 2 giờ</li>
                <li>• Chăm sóc trẻ: 3 giờ</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Chính Sách Hủy Dịch Vụ
          </h3>
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-900">
                Hủy trước 24h: Miễn phí
              </h4>
              <p className="text-emerald-700 text-sm">
                Không tính phí hủy nếu thông báo trước 24 giờ
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900">
                Hủy trước 2h: Phí 50%
              </h4>
              <p className="text-amber-700 text-sm">
                Tính phí 50% giá trị dịch vụ
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900">
                Hủy trong 2h: Phí 100%
              </h4>
              <p className="text-red-700 text-sm">
                Tính phí đầy đủ giá trị dịch vụ
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            4. Trách Nhiệm Bảo Hiểm
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            CleanMate cam kết bảo hiểm toàn diện cho mọi dịch vụ:
          </p>
          <ul className="space-y-2">
            {[
              "Bảo hiểm thiệt hại tài sản lên đến 50 triệu đồng",
              "Bảo hiểm tai nạn lao động cho nhân viên",
              "Cam kết làm lại miễn phí nếu không hài lòng",
            ].map((t) => (
              <li className="flex items-start space-x-3" key={t}>
                <span className="text-emerald-600 mt-1">✓</span>
                <span className="text-gray-700">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function PaymentContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Chính Sách Thanh Toán
      </h2>
      <p className="text-gray-600 mb-6">
        Thông tin về các phương thức và quy định thanh toán
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Phương Thức Thanh Toán
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">💳</div>
              <h4 className="font-medium text-emerald-900 mb-2">
                Thẻ tín dụng
              </h4>
              <p className="text-emerald-700 text-sm">Visa, Mastercard, JCB</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-medium text-amber-900 mb-2">Ví điện tử</h4>
              <p className="text-amber-700 text-sm">MoMo, ZaloPay, VNPay</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-medium text-gray-900 mb-2">Tiền mặt</h4>
              <p className="text-gray-700 text-sm">Thanh toán trực tiếp</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. Thời Điểm Thanh Toán
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-emerald-400 pl-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Thanh toán trước (Khuyến nghị)
              </h4>
              <p className="text-gray-700 mb-2">
                Thanh toán online khi đặt lịch để đảm bảo dịch vụ
              </p>
              <div className="bg-emerald-50 p-3 rounded text-sm text-emerald-700">
                <strong>Ưu đãi:</strong> Giảm 5% khi thanh toán trước
              </div>
            </div>
            <div className="border-l-4 border-gray-300 pl-6">
              <h4 className="font-medium text-gray-900 mb-2">Thanh toán sau</h4>
              <p className="text-gray-700">
                Thanh toán trực tiếp cho nhân viên sau khi hoàn thành dịch vụ
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Bảng Giá Dịch Vụ
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">
                    Dịch vụ
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">
                    Giá/giờ
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">
                    Thời gian tối thiểu
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Dọn dẹp tổng quát", "80.000đ", "2 giờ"],
                  ["Nấu ăn, rửa bát", "90.000đ", "1.5 giờ"],
                  ["Giặt ủi quần áo", "70.000đ", "2 giờ"],
                  ["Chăm sóc trẻ em", "100.000đ", "3 giờ"],
                ].map((r, idx) => (
                  <tr key={r[0]} className={idx % 2 ? "bg-gray-50" : undefined}>
                    <td className="border border-gray-200 px-4 py-3">{r[0]}</td>
                    <td className="border border-gray-200 px-4 py-3 font-medium text-emerald-600">
                      {r[1]}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            * Giá có thể thay đổi vào các ngày lễ tết và cuối tuần
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            4. Chính Sách Phụ Thu
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-medium text-amber-900 mb-3">
              Các trường hợp phụ thu:
            </h4>
            <ul className="space-y-2 text-amber-800">
              <li>• Dịch vụ ngoài giờ (22:00 - 7:00): +30%</li>
              <li>• Ngày lễ, tết: +50%</li>
              <li>• Dịch vụ khẩn cấp (đặt trong 2h): +20%</li>
              <li>• Khu vực xa trung tâm (&gt;15km): +10.000đ/km</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function RefundContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Chính Sách Hoàn Tiền
      </h2>
      <p className="text-gray-600 mb-6">
        Quy định về việc hoàn trả tiền trong các trường hợp cụ thể
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            1. Các Trường Hợp Được Hoàn Tiền
          </h3>
          <div className="space-y-4">
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6">
              <h4 className="font-medium text-emerald-900 mb-2">
                Hoàn tiền 100%
              </h4>
              <ul className="text-emerald-800 space-y-1">
                <li>• Nhân viên không đến làm việc</li>
                <li>• Dịch vụ không được thực hiện</li>
                <li>• Hủy dịch vụ trước 24 giờ</li>
              </ul>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
              <h4 className="font-medium text-blue-900 mb-2">Hoàn tiền 50%</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• Chất lượng dịch vụ không đạt yêu cầu</li>
                <li>• Nhân viên đến muộn quá 30 phút</li>
                <li>• Hủy dịch vụ trong khoảng 2-24 giờ</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            2. Quy Trình Hoàn Tiền
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              {["Gửi yêu cầu", "Xem xét", "Hoàn tiền"].map((step, i) => (
                <div className="text-center" key={step}>
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>Khách hàng gửi yêu cầu hoàn tiền qua hotline hoặc email</div>
              <div>Bộ phận CSKH xem xét và phản hồi trong 24h</div>
              <div>Hoàn tiền trong 3-7 ngày làm việc</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            3. Thời Gian Hoàn Tiền
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Theo phương thức thanh toán:
              </h4>
              <ul className="space-y-2">
                {[
                  ["Thẻ tín dụng:", "5-7 ngày"],
                  ["Ví điện tử:", "1-3 ngày"],
                  ["Chuyển khoản:", "3-5 ngày"],
                ].map(([k, v]) => (
                  <li className="flex justify-between" key={k}>
                    <span className="text-gray-700">{k}</span>
                    <span className="font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Lưu ý quan trọng:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Thời gian có thể kéo dài vào cuối tuần</li>
                <li>• Phí giao dịch do ngân hàng tính</li>
                <li>• Cần cung cấp đầy đủ thông tin tài khoản</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            4. Liên Hệ Hỗ Trợ
          </h3>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <p className="text-emerald-900 mb-4 font-medium">
              Cần hỗ trợ về hoàn tiền? Liên hệ với chúng tôi:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-600">📞</span>
                <div>
                  <p className="font-medium text-emerald-900">Hotline</p>
                  <p className="text-emerald-700">1900 1234</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-600">✉️</span>
                <div>
                  <p className="font-medium text-emerald-900">Email</p>
                  <p className="text-emerald-700">support@cleanmate.vn</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
