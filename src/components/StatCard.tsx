import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  value: number | string;
  label: string;
}

export default function StatCard({ icon, value, label }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-12 h-12 bg-duckweed-50 rounded-lg flex items-center justify-center text-duckweed-600 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
