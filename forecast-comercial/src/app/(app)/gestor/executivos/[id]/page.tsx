import { notFound } from "next/navigation";
import { requireRole } from "@/lib/dal";
import {
  computeKpis,
  getOpportunityById,
  getUserById,
  listOpportunities,
  listOpportunityTypes,
  listSnapshots,
} from "@/lib/db";
import { str, toQuery, type SearchParams } from "@/lib/query";
import KpiCard from "@/components/KpiCard";
import FilterBar from "@/components/FilterBar";
import OpportunityTable from "@/components/OpportunityTable";
import EmptyState from "@/components/EmptyState";
import { OpportunityDetailModal } from "@/components/OpportunityModal";
import type { OpportunityStatus, RevenueType } from "@/lib/types";

export default async function ExecutivoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await requireRole("manager", "admin");
  const { id } = await params;
  const executiveId = Number(id);
  const executive = getUserById(executiveId);
  if (!executive || executive.role !== "executive") notFound();

  const sp = await searchParams;
  const filterParams = {
    client: str(sp.client),
    opportunity_type: str(sp.opportunity_type),
    revenue_type: str(sp.revenue_type),
    status: str(sp.status),
    from: str(sp.from),
    to: str(sp.to),
  };
  const filters = {
    client: filterParams.client,
    opportunityType: filterParams.opportunity_type,
    revenueType: filterParams.revenue_type as RevenueType | "" | undefined,
    status: filterParams.status as OpportunityStatus | "" | undefined,
    from: filterParams.from,
    to: filterParams.to,
  };

  const basePath = `/gestor/executivos/${executiveId}`;
  const closeHref = `${basePath}${toQuery(filterParams)}`;
  const opportunities = listOpportunities(filters, executiveId);
  const kpis = computeKpis(filters, executiveId);
  const opportunityTypes = listOpportunityTypes();

  const viewId = str(sp.view);
  const viewingOpp = viewId ? getOpportunityById(Number(viewId)) : undefined;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">{executive.name}</h1>
        <p className="text-sm text-slate-500">{executive.email}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Forecast" value={kpis.forecast} accent />
        <KpiCard label="Em Assinatura" value={kpis.assinatura} />
        <KpiCard label="Vendido" value={kpis.vendido} />
        <KpiCard label="Perdido" value={kpis.perdida} />
        <KpiCard label="Receita Recorrente" value={kpis.recorrente} />
        <KpiCard label="Receita Não Recorrente" value={kpis.naoRecorrente} />
      </div>

      <FilterBar basePath={basePath} values={filterParams} opportunityTypes={opportunityTypes} />

      {opportunities.length === 0 ? (
        <EmptyState title="Nenhuma oportunidade encontrada." description="Este Executivo ainda não possui oportunidades no período/filtro selecionado." />
      ) : (
        <OpportunityTable
          opportunities={opportunities}
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
