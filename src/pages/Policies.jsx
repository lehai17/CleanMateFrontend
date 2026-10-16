import { Ui, useUiPreferences } from './../ui/Preferences';
// src/pages/Policies.jsx
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function Policies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const active = ["terms", "privacy", "service", "payment", "refund"].includes(requested) ? requested : "terms";
  const { language } = useUiPreferences();
  const contentTopRef = useRef(null);

  useEffect(() => {
    document.title = language === "en" ? "Terms & policies - CleanMate" : "Điều khoản & Chính sách - CleanMate";
  }, [language]);

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
    setSearchParams(previous => { const next = new URLSearchParams(previous); next.set("tab", id); return next; });
    // scroll lên đầu vùng nội dung
    contentTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Ui as="div" className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <Ui as="section" className="bg-gradient-to-r from-emerald-600 to-amber-500 text-white py-16">
        <Ui as="div" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Ui as="h1" className="text-4xl md:text-5xl font-bold mb-6">
            Điều Khoản & Chính Sách
          </Ui>
          <Ui as="p" className="text-xl text-emerald-50/90">
            Thông tin quan trọng về việc sử dụng dịch vụ CleanMate
          </Ui>
        </Ui>
      </Ui>

      {/* Main */}
      <Ui as="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Ui as="div" className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Ui as="aside" className="lg:col-span-1">
            <Ui as="div" className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <Ui as="h3" className="font-semibold text-gray-900 mb-4">Mục lục</Ui>
              <Ui as="nav" className="space-y-2">
                {tabs.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <Ui as="button"
                      type="button"
                      aria-current={isActive ? "page" : undefined}
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
                    </Ui>
                  );
                })}
              </Ui>
            </Ui>
          </Ui>

          {/* Content */}
          <Ui as="section" className="lg:col-span-3">
            <Ui as="div" ref={contentTopRef} />
            <Ui as="div" className="bg-white rounded-xl shadow-sm p-8">
              {active === "terms" && <TermsContent />}
              {active === "privacy" && <PrivacyContent />}
              {active === "service" && <ServiceContent />}
              {active === "payment" && <PaymentContent />}
              {active === "refund" && <RefundContent />}
            </Ui>
          </Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}

/* =================== Content Blocks =================== */

function TermsContent() {
  return (
    <Ui as="div">
      <Ui as="h2" className="text-3xl font-bold text-gray-900 mb-6">
        Điều Khoản Sử Dụng
      </Ui>
      <Ui as="p" className="text-gray-600 mb-6">Cập nhật lần cuối: 19/09/2025</Ui>

      <Ui as="div" className="space-y-8">
        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            1. Chấp Nhận Điều Khoản
          </Ui>
          <Ui as="p" className="text-gray-700 leading-relaxed mb-4">
            Bằng việc truy cập và sử dụng dịch vụ CleanMate, bạn đồng ý tuân thủ
            và bị ràng buộc bởi các điều khoản và điều kiện được nêu trong tài
            liệu này.
          </Ui>
          <Ui as="p" className="text-gray-700 leading-relaxed">
            Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui
            lòng không sử dụng dịch vụ của chúng tôi.
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            2. Mô Tả Dịch Vụ
          </Ui>
          <Ui as="p" className="text-gray-700 leading-relaxed mb-4">
            CleanMate là nền tảng kết nối khách hàng với các nhân viên giúp việc
            chuyên nghiệp. Chúng tôi cung cấp:
          </Ui>
          <Ui as="ul" className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <Ui as="li">Dịch vụ dọn dẹp nhà cửa theo giờ</Ui>
            <Ui as="li">Dịch vụ nấu ăn và rửa bát</Ui>
            <Ui as="li">Dịch vụ giặt ủi quần áo</Ui>
            <Ui as="li">Dịch vụ chăm sóc trẻ em</Ui>
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            3. Đăng Ký Tài Khoản
          </Ui>
          <Ui as="p" className="text-gray-700 leading-relaxed mb-4">
            Để sử dụng dịch vụ, bạn cần tạo tài khoản với thông tin chính xác và
            đầy đủ. Bạn có trách nhiệm:
          </Ui>
          <Ui as="ul" className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <Ui as="li">Bảo mật thông tin đăng nhập</Ui>
            <Ui as="li">Thông báo ngay khi phát hiện tài khoản bị xâm phạm</Ui>
            <Ui as="li">Cập nhật thông tin khi có thay đổi</Ui>
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            4. Quyền và Nghĩa Vụ Của Khách Hàng
          </Ui>
          <Ui as="div" className="bg-emerald-50 p-6 rounded-lg mb-4">
            <Ui as="h4" className="font-semibold text-emerald-900 mb-2">
              Quyền của khách hàng:
            </Ui>
            <Ui as="ul" className="list-disc list-inside text-emerald-800 space-y-1">
              <Ui as="li">Nhận dịch vụ chất lượng theo đúng cam kết</Ui>
              <Ui as="li">Được bảo vệ thông tin cá nhân</Ui>
              <Ui as="li">Khiếu nại khi dịch vụ không đạt yêu cầu</Ui>
            </Ui>
          </Ui>
          <Ui as="div" className="bg-amber-50 p-6 rounded-lg">
            <Ui as="h4" className="font-semibold text-amber-900 mb-2">
              Nghĩa vụ của khách hàng:
            </Ui>
            <Ui as="ul" className="list-disc list-inside text-amber-800 space-y-1">
              <Ui as="li">Thanh toán đầy đủ và đúng hạn</Ui>
              <Ui as="li">Cung cấp thông tin chính xác</Ui>
              <Ui as="li">Tôn trọng nhân viên dịch vụ</Ui>
              <Ui as="li">Tuân thủ các quy định an toàn</Ui>
            </Ui>
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            5. Giới Hạn Trách Nhiệm
          </Ui>
          <Ui as="p" className="text-gray-700 leading-relaxed">
            CleanMate không chịu trách nhiệm về các thiệt hại gián tiếp, ngẫu
            nhiên hoặc hậu quả phát sinh từ việc sử dụng dịch vụ. Trách nhiệm
            của chúng tôi được giới hạn trong phạm vi giá trị dịch vụ đã thanh
            toán.
          </Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}

function PrivacyContent() {
  return (
    <Ui as="div">
      <Ui as="h2" className="text-3xl font-bold text-gray-900 mb-6">
        Chính Sách Bảo Mật
      </Ui>
      <Ui as="p" className="text-gray-600 mb-6">Cập nhật lần cuối: 15/12/2024</Ui>

      <Ui as="div" className="space-y-8">
        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            1. Thông Tin Chúng Tôi Thu Thập
          </Ui>
          <Ui as="div" className="grid md:grid-cols-2 gap-6">
            <Ui as="div" className="bg-emerald-50 p-6 rounded-lg">
              <Ui as="h4" className="font-semibold text-emerald-900 mb-3">
                Thông tin cá nhân:
              </Ui>
              <Ui as="ul" className="text-emerald-800 space-y-1 text-sm">
                <Ui as="li">• Họ tên, số điện thoại</Ui>
                <Ui as="li">• Địa chỉ email</Ui>
                <Ui as="li">• Địa chỉ nhà</Ui>
                <Ui as="li">• Thông tin xác nhận nhận tiền mặt</Ui>
              </Ui>
            </Ui>
            <Ui as="div" className="bg-amber-50 p-6 rounded-lg">
              <Ui as="h4" className="font-semibold text-amber-900 mb-3">
                Thông tin sử dụng:
              </Ui>
              <Ui as="ul" className="text-amber-800 space-y-1 text-sm">
                <Ui as="li">• Lịch sử đặt dịch vụ</Ui>
                <Ui as="li">• Thời gian truy cập</Ui>
                <Ui as="li">• Thiết bị sử dụng</Ui>
                <Ui as="li">• Địa chỉ IP</Ui>
              </Ui>
            </Ui>
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            2. Mục Đích Sử Dụng Thông Tin
          </Ui>
          <Ui as="div" className="space-y-4">
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
              <Ui as="div" className="flex items-start space-x-3" key={i.title}>
                <Ui as="div" className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Ui as="span" className="text-emerald-600 text-sm">✓</Ui>
                </Ui>
                <Ui as="div">
                  <Ui as="h4" className="font-medium text-gray-900">{i.title}</Ui>
                  <Ui as="p" className="text-gray-600 text-sm">{i.desc}</Ui>
                </Ui>
              </Ui>
            ))}
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            3. Bảo Mật Thông Tin
          </Ui>
          <Ui as="div" className="bg-gray-50 p-6 rounded-lg">
            <Ui as="p" className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ thông tin của
              bạn:
            </Ui>
            <Ui as="div" className="grid md:grid-cols-2 gap-4">
              {[
                "Mã hóa SSL/TLS",
                "Tường lửa bảo mật",
                "Kiểm soát truy cập",
                "Giám sát 24/7",
              ].map((t) => (
                <Ui as="div" className="flex items-center space-x-2" key={t}>
                  <Ui as="span" className="text-emerald-600">🔐</Ui>
                  <Ui as="span" className="text-sm text-gray-700">{t}</Ui>
                </Ui>
              ))}
            </Ui>
          </Ui>
        </Ui>

        <Ui as="section">
          <Ui as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            4. Quyền Của Bạn
          </Ui>
          <Ui as="ul" className="space-y-2">
            {[
              "Cung cấp thông tin cá nhân đang được lưu trữ",
              "Chỉnh sửa hoặc cập nhật thông tin",
              "Xóa thông tin cá nhân",
              "Từ chối nhận email marketing",
            ].map((t) => (
              <Ui as="li" className="flex items-center space-x-2" key={t}>
                <Ui as="span" className="w-2 h-2 bg-emerald-600 rounded-full"></Ui>
                <Ui as="span" className="text-gray-700">{t}</Ui>
              </Ui>
            ))}
          </Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}

function ServiceContent() {
  return <Ui as="div" className="space-y-6 text-gray-700">
    <Ui as="h2" className="text-3xl font-bold text-gray-900">Điều Khoản Dịch Vụ</Ui>
    <Ui as="p">CleanMate kết nối khách hàng và cleaner, hỗ trợ đặt lịch và ghi nhận quá trình làm việc.</Ui>
    <Ui as="ol" className="list-decimal list-inside space-y-3">
      <Ui as="li">Khách chọn dịch vụ, thời gian và địa chỉ; kiểm tra giá trước khi xác nhận đặt lịch.</Ui>
      <Ui as="li">Cleaner nhận việc, bắt đầu và xác nhận hoàn thành ca.</Ui>
      <Ui as="li">Khách kiểm tra công việc và trả tiền mặt trực tiếp cho cleaner sau ca.</Ui>
      <Ui as="li">Khách xác nhận hoàn thành và đánh giá chất lượng trên đơn hàng.</Ui>
    </Ui>
    <Ui as="h3" className="text-xl font-semibold text-gray-900">Hủy lịch</Ui>
    <Ui as="p">Khách có thể hủy trên hệ thống khi đơn đang chờ nhận, chưa có cleaner phụ trách và chưa đến giờ bắt đầu. Đơn đã có cleaner nhận cần được trao đổi với cleaner để xử lý thay đổi.</Ui>
    <Ui as="p">CleanMate không tự động thu phí hủy lịch hoặc trừ tiền của khách và cleaner.</Ui>
  </Ui>;
}

function PaymentContent() {
  return <Ui as="div" className="space-y-6 text-gray-700">
    <Ui as="h2" className="text-3xl font-bold text-gray-900">Chính Sách Thanh Toán</Ui>
    <Ui as="section" className="rounded-xl bg-emerald-50 p-6">
      <Ui as="h3" className="text-xl font-semibold text-emerald-900">Tiền mặt trực tiếp sau khi hoàn thành ca</Ui>
      <Ui as="p" className="mt-3">Khách trả đủ số tiền của đơn hàng trực tiếp cho cleaner. Hai bên kiểm tra số tiền trước khi kết thúc ca.</Ui>
      <Ui as="p" className="mt-3">CleanMate chỉ kết nối dịch vụ, không thu, giữ hoặc chuyển tiền giữa hai bên.</Ui>
    </Ui>
    <Ui as="section">
      <Ui as="h3" className="text-xl font-semibold text-gray-900">Ghi nhận trên hệ thống</Ui>
      <Ui as="p" className="mt-3">Cleaner có thể xác nhận đã nhận đủ tiền mặt sau khi hoàn thành công việc. Đây là thông tin do cleaner cung cấp; hệ thống lưu thời gian xác nhận.</Ui>
      <Ui as="p" className="mt-3">Khách xác nhận hoàn thành và đánh giá công việc riêng. Việc đánh giá không tự động xác nhận đã trả tiền.</Ui>
    </Ui>
    <Ui as="section">
      <Ui as="h3" className="text-xl font-semibold text-gray-900">Giá dịch vụ</Ui>
      <Ui as="p" className="mt-3">Giá được hiển thị và xác nhận khi đặt lịch. Khách và cleaner kiểm tra thông tin đơn trước khi thực hiện công việc.</Ui>
      <Ui as="p" className="mt-3">Hệ thống hiện không thu hoa hồng hoặc tính phí nền tảng vào khoản tiền phải trả cho cleaner.</Ui>
    </Ui>
  </Ui>;
}

function RefundContent() {
  return <Ui as="div" className="space-y-6 text-gray-700">
    <Ui as="h2" className="text-3xl font-bold text-gray-900">Hỗ trợ sau dịch vụ</Ui>
    <Ui as="p">Nếu có vấn đề về chất lượng hoặc số tiền đã giao nhận, khách và cleaner trao đổi trực tiếp để thống nhất cách xử lý.</Ui>
    <Ui as="p">Khoản hoàn trả tiền mặt, nếu có, được thực hiện trực tiếp giữa hai bên. CleanMate không có khoản tiền đã thu để hoàn lại qua hệ thống.</Ui>
    <Ui as="p">Hai bên nên giữ thông tin mã đơn, thời gian làm việc và nội dung trao đổi để đối chiếu. Khách có thể ghi nhận đánh giá trung thực trên đơn hàng.</Ui>
  </Ui>;
}
