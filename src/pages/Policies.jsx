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
      { id: "payment", label: "💵 Chính sách thanh toán" },
      { id: "refund", label: "🔄 Hỗ trợ sau dịch vụ" },
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
                <li>• Thông tin xác nhận nhận tiền mặt</li>
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
  return <div className="space-y-6 text-gray-700">
    <h2 className="text-3xl font-bold text-gray-900">Điều Khoản Dịch Vụ</h2>
    <p>CleanMate kết nối khách hàng và cleaner, hỗ trợ đặt lịch và ghi nhận quá trình làm việc.</p>
    <ol className="list-decimal list-inside space-y-3">
      <li>Khách chọn dịch vụ, thời gian và địa chỉ; kiểm tra giá trước khi xác nhận đặt lịch.</li>
      <li>Cleaner nhận việc, bắt đầu và xác nhận hoàn thành ca.</li>
      <li>Khách kiểm tra công việc và trả tiền mặt trực tiếp cho cleaner sau ca.</li>
      <li>Khách xác nhận hoàn thành và đánh giá chất lượng trên đơn hàng.</li>
    </ol>
    <h3 className="text-xl font-semibold text-gray-900">Hủy lịch</h3>
    <p>Khách có thể hủy trên hệ thống khi đơn đang chờ nhận, chưa có cleaner phụ trách và chưa đến giờ bắt đầu. Đơn đã có cleaner nhận cần được trao đổi với cleaner để xử lý thay đổi.</p>
    <p>CleanMate không tự động thu phí hủy lịch hoặc trừ tiền của khách và cleaner.</p>
  </div>;
}

function PaymentContent() {
  return <div className="space-y-6 text-gray-700">
    <h2 className="text-3xl font-bold text-gray-900">Chính Sách Thanh Toán</h2>
    <section className="rounded-xl bg-emerald-50 p-6">
      <h3 className="text-xl font-semibold text-emerald-900">Tiền mặt trực tiếp sau khi hoàn thành ca</h3>
      <p className="mt-3">Khách trả đủ số tiền của đơn hàng trực tiếp cho cleaner. Hai bên kiểm tra số tiền trước khi kết thúc ca.</p>
      <p className="mt-3">CleanMate chỉ kết nối dịch vụ, không thu, giữ hoặc chuyển tiền giữa hai bên.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-900">Ghi nhận trên hệ thống</h3>
      <p className="mt-3">Cleaner có thể xác nhận đã nhận đủ tiền mặt sau khi hoàn thành công việc. Đây là thông tin do cleaner cung cấp; hệ thống lưu thời gian xác nhận.</p>
      <p className="mt-3">Khách xác nhận hoàn thành và đánh giá công việc riêng. Việc đánh giá không tự động xác nhận đã trả tiền.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-900">Giá dịch vụ</h3>
      <p className="mt-3">Giá được hiển thị và xác nhận khi đặt lịch. Khách và cleaner kiểm tra thông tin đơn trước khi thực hiện công việc.</p>
      <p className="mt-3">Hệ thống hiện không thu hoa hồng hoặc tính phí nền tảng vào khoản tiền phải trả cho cleaner.</p>
    </section>
  </div>;
}

function RefundContent() {
  return <div className="space-y-6 text-gray-700">
    <h2 className="text-3xl font-bold text-gray-900">Hỗ trợ sau dịch vụ</h2>
    <p>Nếu có vấn đề về chất lượng hoặc số tiền đã giao nhận, khách và cleaner trao đổi trực tiếp để thống nhất cách xử lý.</p>
    <p>Khoản hoàn trả tiền mặt, nếu có, được thực hiện trực tiếp giữa hai bên. CleanMate không có khoản tiền đã thu để hoàn lại qua hệ thống.</p>
    <p>Hai bên nên giữ thông tin mã đơn, thời gian làm việc và nội dung trao đổi để đối chiếu. Khách có thể ghi nhận đánh giá trung thực trên đơn hàng.</p>
  </div>;
}