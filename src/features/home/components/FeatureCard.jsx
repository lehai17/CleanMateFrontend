import { Ui } from './../../../ui/Preferences';
export default function FeatureCard({ icon, title, description }) {
  return (
    <Ui as="article" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Ui as="div" className="mb-4 text-4xl" aria-hidden>
        {icon}
      </Ui>
      <Ui as="h3" className="mb-3 text-xl font-semibold text-gray-900">{title}</Ui>
      <Ui as="p" className="text-gray-600">{description}</Ui>
    </Ui>
  );
}
