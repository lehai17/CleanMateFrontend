import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import ServiceCard from "../components/ServiceCard";
import StepCard from "../components/StepCard";
import { featureItems, serviceItems, stepItems } from "../data/homeContent";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-500 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              Dịch vụ giúp việc theo giờ đáng tin cậy
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Giúp việc chuyên nghiệp, đặt lịch nhanh và rõ ràng chi phí
            </h1>
            <p className="mb-8 text-lg text-emerald-50">
              CleanMate giúp bạn kết nối nhanh với người hỗ trợ phù hợp cho việc
              dọn dẹp, nấu ăn, giặt ủi và chăm sóc gia đình.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/booking")}
                className="rounded-2xl bg-white px-7 py-4 font-semibold text-gray-900 transition-transform hover:scale-[1.02]"
              >
                Đặt lịch ngay
              </button>
              <button
                onClick={() => navigate("/services")}
                className="rounded-2xl border border-white/60 px-7 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                Xem bảng giá dịch vụ
              </button>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] bg-white/10 p-6 backdrop-blur">
            <div className="rounded-3xl bg-white/15 p-6">
              <div className="mb-3 text-5xl">✨</div>
              <h2 className="mb-2 text-2xl font-bold">Tiện lợi cho lịch bận rộn</h2>
              <p className="text-emerald-50">
                Theo dõi đơn hàng, quản lý hồ sơ và đặt lại dịch vụ chỉ trong vài thao tác.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/15 p-5">
                <div className="mb-2 text-3xl">📅</div>
                <p className="font-semibold">Lịch linh hoạt theo giờ</p>
              </div>
              <div className="rounded-3xl bg-white/15 p-5">
                <div className="mb-2 text-3xl">💬</div>
                <p className="font-semibold">Thông tin rõ ràng, dễ theo dõi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Vì sao nên chọn CleanMate?
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Nền tảng được sắp xếp để khách hàng dễ đặt lịch, dễ theo dõi và
              dễ sử dụng trên cả web lẫn mobile.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureItems.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-500 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Dịch vụ nổi bật</h2>
            <p className="mx-auto max-w-3xl text-lg text-emerald-50">
              Các nhóm dịch vụ được hiển thị rõ ràng để người dùng dễ hiểu và dễ
              thao tác hơn.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {serviceItems.map((item) => (
              <ServiceCard
                key={item.title}
                {...item}
                onBook={() => navigate("/booking")}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Quy trình sử dụng
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Chỉ cần ba bước để hoàn thành một đơn dịch vụ trên CleanMate.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {stepItems.map((item) => (
              <StepCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-600 to-amber-500 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Sẵn sàng trải nghiệm dịch vụ?</h2>
          <p className="mb-8 text-lg text-emerald-50">
            Đặt lịch ngay để bắt đầu với giao diện mới gọn hơn và nội dung tiếng
            Việt rõ ràng hơn.
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="rounded-2xl bg-white px-8 py-4 font-semibold text-gray-900 transition-transform hover:scale-[1.02]"
          >
            Đặt lịch ngay
          </button>
        </div>
      </section>
    </div>
  );
}
