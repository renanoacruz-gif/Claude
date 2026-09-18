import Link from "next/link";
import { requireRole } from "@/lib/dal";
import { computeKpis, getRecentChanges, listOpportunities } from "@/lib/db";
import KpiCard from "@/components/KpiCard";
import OpportunityTable from "@/components/OpportunityTable";
import EmptyState from "@/components/EmptyState";
import { formatDateTime } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireRole("executive");
  const kpis = computeKpis({}, user.id);
  const opportunities = listOpportunities({}, user.id).slice(0, 6);
  const changes = getRecentChanges(user.id).slice(0, 6);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Olá, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-slate-500">Visão geral do seu forecast comercial.</p>
        </div>
        <Link href="/forecast?modal=new" className="btn btn-primary">
          + Nova Oportunidade
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Forecast" value={kpis.forecast} accent />
        <KpiCard label="Em Assinatura" value={kpis.assinatura} />
        <KpiCard label="Vendido" value={kpis.vendido} />
        <KpiCard label="Perdido" value={kpis.perdida} />
        <KpiCard label="Receita Recorrente" value={kpis.recorrente} />
        <KpiCard label="Receita Não Recorrente" value={kpis.naoRecorrente} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Oportunidades recentes</h2>
            <Link href="/forecast" className="text-sm text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>
          {opportunities.length === 0 ? (
            <EmptyState
              title="Você ainda não possui oportunidades neste forecast."
              description="Cadastre sua primeira oportunidade para começar a reportar seu forecast ao seu gestor."
              actionHref="/forecast?modal=new"
              actionLabel="Adicionar primeira oportunidade"
            />
          ) : (
            <OpportunityTable
              opportunities={opportunities}
              canManage={() => false}
              basePath="/forecast"
              returnTo="/forecast"
            />
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">O que mudou desde o último reporte</h2>
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
