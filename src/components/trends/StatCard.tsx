interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-courteney-purple-50 flex items-center justify-center text-courteney-purple-500">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
