export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 text-4xl" aria-hidden>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </article>
  );
}
