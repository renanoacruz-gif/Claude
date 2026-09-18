import { requireRole } from "@/lib/dal";
import { computeKpis, getOpportunityById, listOpportunities, listOpportunityTypes, listSnapshots } from "@/lib/db";
import { str, toQuery, type SearchParams } from "@/lib/query";
import KpiCard from "@/components/KpiCard";
import FilterBar from "@/components/FilterBar";
import OpportunityTable from "@/components/OpportunityTable";
import EmptyState from "@/components/EmptyState";
import { OpportunityFormModal, OpportunityDetailModal } from "@/components/OpportunityModal";
import type { OpportunityStatus, RevenueType } from "@/lib/types";

export default async function ForecastPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireRole("executive");
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

  const basePath = "/forecast";
  const filterQuery = toQuery(filterParams);
  const closeHref = `${basePath}${filterQuery}`;
  const newHref = `${basePath}${toQuery({ ...filterParams, modal: "new" })}`;

  const opportunities = listOpportunities(filters, user.id);
  const kpis = computeKpis(filters, user.id);
  const opportunityTypes = listOpportunityTypes();
  const hasFilters = Object.values(filterParams).some(Boolean);

  const editId = str(sp.edit);
  const viewId = str(sp.view);
  const isNew = str(sp.modal) === "new";
  const errorCode = str(sp.error);

  const editingOpp = editId ? getOpportunityById(Number(editId)) : undefined;
  const viewingOpp = viewId ? getOpportunityById(Number(viewId)) : undefined;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Meu Forecast</h1>
          <p className="text-sm text-slate-500">Atualize suas oportunidades em poucos cliques.</p>
        </div>
        <a href={newHref} className="btn btn-primary">
          + Nova Oportunidade
        </a>
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

      {opportunities.length === 0 && !hasFilters ? (
        <EmptyState
          title="Você ainda não possui oportunidades neste forecast."
          description="Cadastre sua primeira oportunidade para começar a reportar seu forecast ao seu gestor."
          actionHref={newHref}
          actionLabel="Adicionar primeira oportunidade"
        />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="Nenhuma oportunidade encontrada."
          description="Ajuste os filtros para ver outras oportunidades."
          actionHref={basePath}
          actionLabel="Limpar filtros"
        />
      ) : (
        <OpportunityTable
          opportunities={opportunities}
          canManage={() => true}
          basePath={basePath}
          returnTo={closeHref}
        />
      )}

      {isNew && (
        <OpportunityFormModal
          mode="new"
          opportunityTypes={opportunityTypes}
          executiveName={user.name}
          closeHref={closeHref}
          returnTo={closeHref}
          errorCode={errorCode}
        />
      )}

      {editingOpp && editingOpp.executive_id === user.id && (
        <OpportunityFormModal
          mode="edit"
          opportunity={editingOpp}
          opportunityTypes={opportunityTypes}
          executiveName={user.name}
          closeHref={closeHref}
          returnTo={closeHref}
          errorCode={errorCode}
        />
      )}

      {viewingOpp && viewingOpp.executive_id === user.id && (
        <OpportunityDetailModal
          opportunity={viewingOpp}
          snapshots={listSnapshots({ opportunityId: viewingOpp.id }).slice(0, 8)}
          closeHref={closeHref}
          editHref={`${basePath}${toQuery({ ...filterParams, edit: viewingOpp.id })}`}
          canManage
        />
      )}
    </div>
  );
}
