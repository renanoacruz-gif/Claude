import Link from "next/link";
import { requireRole } from "@/lib/dal";
import { summaryByExecutive } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

export default async function GestorExecutivosPage() {
  await requireRole("manager", "admin");
  const summary = summaryByExecutive();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Executivos</h1>
        <p className="text-sm text-slate-500">Selecione um Executivo para ver sua visão detalhada.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((r) => (
          <Link
            key={r.executive_id}
            href={`/gestor/executivos/${r.executive_id}`}
            className="card p-5 transition hover:border-brand-500"
          >
            <p className="text-sm font-semibold text-slate-900">{r.executive_name}</p>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
              <dt className="text-slate-500">Forecast</dt>
              <dd className="text-right font-medium text-slate-900">{formatCurrency(r.forecast)}</dd>
              <dt className="text-slate-500">Assinatura</dt>
              <dd className="text-right font-medium text-slate-900">{formatCurrency(r.assinatura)}</dd>
              <dt className="text-slate-500">Vendido</dt>
              <dd className="text-right font-medium text-slate-900">{formatCurrency(r.vendido)}</dd>
              <dt className="text-slate-500">Perdido</dt>
              <dd className="text-right font-medium text-slate-900">{formatCurrency(r.perdida)}</dd>
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}
