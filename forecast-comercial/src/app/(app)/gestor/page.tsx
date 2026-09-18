import Link from "next/link";
import { requireRole } from "@/lib/dal";
import { computeKpis, getRecentChanges, summaryByExecutive } from "@/lib/db";
import KpiCard from "@/components/KpiCard";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function GestorDashboardPage() {
  await requireRole("manager", "admin");
  const kpis = computeKpis({});
  const summary = summaryByExecutive();
  const changes = getRecentChanges(undefined).slice(0, 8);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard da Equipe</h1>
        <p className="text-sm text-slate-500">Visão consolidada do forecast de todos os Executivos.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Forecast Total" value={kpis.forecast} accent />
        <KpiCard label="Em Assinatura" value={kpis.assinatura} />
        <KpiCard label="Vendas Concretizadas" value={kpis.vendido} />
        <KpiCard label="Perdas" value={kpis.perdida} />
        <KpiCard label="Receita Recorrente" value={kpis.recorrente} />
        <KpiCard label="Receita Não Recorrente" value={kpis.naoRecorrente} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Forecast por Executivo</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Executivo</th>
                    <th>Forecast</th>
                    <th>Assinatura</th>
                    <th>Vendido</th>
                    <th>Perdido</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((r) => (
                    <tr key={r.executive_id}>
                      <td>
                        <Link
                          href={`/gestor/executivos/${r.executive_id}`}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {r.executive_name}
                        </Link>
                      </td>
                      <td>{formatCurrency(r.forecast)}</td>
                      <td>{formatCurrency(r.assinatura)}</td>
                      <td>{formatCurrency(r.vendido)}</td>
                      <td>{formatCurrency(r.perdida)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Alterações recentes na equipe</h2>
          <div className="card divide-y divide-slate-100">
            {changes.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Nenhuma alteração recente.</p>
            ) : (
              changes.map((c, i) => (
                <div key={i} className="p-3">
                  <p className="text-sm font-medium text-slate-900">{c.client}</p>
                  <p className="text-xs text-slate-500">{c.description}</p>
                  <p className="mt-1 text-xs text-brand-600">{c.detail}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{formatDateTime(c.report_date)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
