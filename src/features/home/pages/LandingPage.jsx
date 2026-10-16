import { Ui } from './../../../ui/Preferences';
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import ServiceCard from "../components/ServiceCard";
import StepCard from "../components/StepCard";
import { featureItems, serviceItems, stepItems } from "../data/homeContent";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Ui as="div" className="min-h-screen bg-slate-50">
      <Ui as="section" className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-500 py-20 text-white">
        <Ui as="div" className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Ui as="div" className="max-w-2xl">
            <Ui as="p" className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              Dịch vụ giúp việc theo giờ đáng tin cậy
            </Ui>
            <Ui as="h1" className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Giúp việc chuyên nghiệp, đặt lịch nhanh và rõ ràng chi phí
            </Ui>
            <Ui as="p" className="mb-8 text-lg text-emerald-50">
              CleanMate giúp bạn kết nối nhanh với người hỗ trợ phù hợp cho việc
              dọn dẹp, nấu ăn, giặt ủi và chăm sóc gia đình.
            </Ui>
            <Ui as="div" className="flex flex-col gap-4 sm:flex-row">
              <Ui as="button"
                onClick={() => navigate("/booking")}
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-gray-900 transition-transform hover:scale-[1.02]"
              >
                Đặt lịch ngay
              </Ui>
              <Ui as="button"
                onClick={() => navigate("/services")}
                className="rounded-2xl border border-white/60 px-7 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                Xem bảng giá dịch vụ
              </Ui>
            </Ui>
          </Ui>

          <Ui as="div" className="grid gap-4 rounded-[2rem] bg-white/10 p-6 backdrop-blur">
            <Ui as="div" className="rounded-3xl bg-white/15 p-6">
              <Ui as="div" className="mb-3 text-5xl">✨</Ui>
              <Ui as="h2" className="mb-2 text-2xl font-bold">Tiện lợi cho lịch bận rộn</Ui>
              <Ui as="p" className="text-emerald-50">
                Theo dõi đơn hàng, quản lý hồ sơ và đặt lại dịch vụ chỉ trong vài thao tác.
              </Ui>
            </Ui>
            <Ui as="div" className="grid gap-4 md:grid-cols-2">
              <Ui as="div" className="rounded-3xl bg-white/15 p-5">
                <Ui as="div" className="mb-2 text-3xl">📅</Ui>
                <Ui as="p" className="font-semibold">Lịch linh hoạt theo giờ</Ui>
              </Ui>
              <Ui as="div" className="rounded-3xl bg-white/15 p-5">
                <Ui as="div" className="mb-2 text-3xl">💬</Ui>
                <Ui as="p" className="font-semibold">Thông tin rõ ràng, dễ theo dõi</Ui>
              </Ui>
            </Ui>
          </Ui>
        </Ui>
      </Ui>

      <Ui as="section" className="py-20">
        <Ui as="div" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Ui as="div" className="mb-12 text-center">
            <Ui as="h2" className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Vì sao nên chọn CleanMate?
            </Ui>
            <Ui as="p" className="mx-auto max-w-3xl text-lg text-gray-600">
              Nền tảng được sắp xếp để khách hàng dễ đặt lịch, dễ theo dõi và
              dễ sử dụng trên cả web lẫn mobile.
            </Ui>
          </Ui>
          <Ui as="div" className="grid gap-6 md:grid-cols-3">
            {featureItems.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </Ui>
        </Ui>
      </Ui>

      <Ui as="section" className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-500 py-20 text-white">
        <Ui as="div" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Ui as="div" className="mb-12 text-center">
            <Ui as="h2" className="mb-4 text-3xl font-bold md:text-4xl">Dịch vụ nổi bật</Ui>
            <Ui as="p" className="mx-auto max-w-3xl text-lg text-emerald-50">
              Các nhóm dịch vụ được hiển thị rõ ràng để người dùng dễ hiểu và dễ
              thao tác hơn.
            </Ui>
          </Ui>
          <Ui as="div" className="grid gap-6 lg:grid-cols-4">
            {serviceItems.map((item) => (
              <ServiceCard
                key={item.title}
                {...item}
                onBook={() => navigate("/booking")}
              />
            ))}
          </Ui>
        </Ui>
      </Ui>

      <Ui as="section" className="bg-white py-20">
        <Ui as="div" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Ui as="div" className="mb-12 text-center">
            <Ui as="h2" className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Quy trình sử dụng
            </Ui>
            <Ui as="p" className="mx-auto max-w-3xl text-lg text-gray-600">
              Chỉ cần ba bước để hoàn thành một đơn dịch vụ trên CleanMate.
            </Ui>
          </Ui>
          <Ui as="div" className="grid gap-8 md:grid-cols-3">
            {stepItems.map((item) => (
              <StepCard key={item.number} {...item} />
            ))}
          </Ui>
        </Ui>
      </Ui>

      <Ui as="section" className="bg-gradient-to-r from-emerald-600 to-amber-500 py-16 text-white">
        <Ui as="div" className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Ui as="h2" className="mb-4 text-3xl font-bold">Sẵn sàng trải nghiệm dịch vụ?</Ui>
          <Ui as="p" className="mb-8 text-lg text-emerald-50">
            Đặt lịch ngay để bắt đầu với giao diện mới gọn hơn và nội dung tiếng
            Việt rõ ràng hơn.
          </Ui>
          <Ui as="button"
            onClick={() => navigate("/booking")}
            className="rounded-2xl bg-white px-8 py-4 font-semibold text-gray-900 transition-transform hover:scale-[1.02]"
          >
            Đặt lịch ngay
          </Ui>
        </Ui>
      </Ui>
    </Ui>
  );
}
