import { requireRole } from "@/lib/dal";
import { computeKpis, getOpportunityById, listExecutives, listOpportunities, listOpportunityTypes, listSnapshots } from "@/lib/db";
import { str, toQuery, type SearchParams } from "@/lib/query";
import KpiCard from "@/components/KpiCard";
import FilterBar from "@/components/FilterBar";
import OpportunityTable from "@/components/OpportunityTable";
import EmptyState from "@/components/EmptyState";
import { OpportunityDetailModal } from "@/components/OpportunityModal";
import type { OpportunityStatus, RevenueType } from "@/lib/types";

export default async function GestorOportunidadesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole("manager", "admin");
  const sp = await searchParams;

  const filterParams = {
    executive_id: str(sp.executive_id),
    client: str(sp.client),
    opportunity_type: str(sp.opportunity_type),
    revenue_type: str(sp.revenue_type),
    status: str(sp.status),
    from: str(sp.from),
    to: str(sp.to),
  };
  const filters = {
    executiveId: filterParams.executive_id ? Number(filterParams.executive_id) : undefined,
    client: filterParams.client,
    opportunityType: filterParams.opportunity_type,
    revenueType: filterParams.revenue_type as RevenueType | "" | undefined,
    status: filterParams.status as OpportunityStatus | "" | undefined,
    from: filterParams.from,
    to: filterParams.to,
  };

  const basePath = "/gestor/oportunidades";
  const closeHref = `${basePath}${toQuery(filterParams)}`;
  const opportunities = listOpportunities(filters);
  const kpis = computeKpis(filters);
  const opportunityTypes = listOpportunityTypes();
  const executives = listExecutives().map((e) => ({ id: e.id, name: e.name }));

  const viewId = str(sp.view);
  const viewingOpp = viewId ? getOpportunityById(Number(viewId)) : undefined;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Oportunidades da Equipe</h1>
        <p className="text-sm text-slate-500">Visão consolidada de todas as oportunidades reportadas.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Forecast" value={kpis.forecast} accent />
        <KpiCard label="Em Assinatura" value={kpis.assinatura} />
        <KpiCard label="Vendido" value={kpis.vendido} />
        <KpiCard label="Perdido" value={kpis.perdida} />
        <KpiCard label="Receita Recorrente" value={kpis.recorrente} />
        <KpiCard label="Receita Não Recorrente" value={kpis.naoRecorrente} />
      </div>

      <FilterBar basePath={basePath} values={filterParams} opportunityTypes={opportunityTypes} executives={executives} />

      {opportunities.length === 0 ? (
        <EmptyState title="Nenhuma oportunidade encontrada." description="Ajuste os filtros para ver outras oportunidades." />
      ) : (
        <OpportunityTable
          opportunities={opportunities}
          showExecutive
          canManage={() => false}
          basePath={basePath}
          returnTo={closeHref}
        />
      )}

      {viewingOpp && (
        <OpportunityDetailModal
          opportunity={viewingOpp}
          snapshots={listSnapshots({ opportunityId: viewingOpp.id }).slice(0, 8)}
          closeHref={closeHref}
          editHref={closeHref}
          canManage={false}
        />
      )}
    </div>
  );
}
