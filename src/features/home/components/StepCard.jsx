import { Ui } from './../../../ui/Preferences';
export default function StepCard({ number, title, description }) {
  return (
    <Ui as="article" className="text-center">
      <Ui as="div" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
        {number}
      </Ui>
      <Ui as="h3" className="mb-3 text-xl font-semibold text-gray-900">{title}</Ui>
      <Ui as="p" className="text-gray-600">{description}</Ui>
    </Ui>
  );
}
