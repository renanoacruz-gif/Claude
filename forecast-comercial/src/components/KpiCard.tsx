import { formatCurrency } from "@/lib/format";

export default function KpiCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${accent ? "text-brand-600" : "text-slate-900"}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
