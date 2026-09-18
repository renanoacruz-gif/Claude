import { REVENUE_LABEL, STATUS_LABEL, STATUS_ORDER } from "@/lib/types";

export interface FilterValues {
  client?: string;
  opportunity_type?: string;
  revenue_type?: string;
  status?: string;
  from?: string;
  to?: string;
  executive_id?: string;
}

function Fields({
  values,
  opportunityTypes,
  executives,
}: {
  values: FilterValues;
  opportunityTypes: string[];
  executives?: { id: number; name: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {executives && (
        <div>
          <label className="field-label">Executivo</label>
          <select name="executive_id" defaultValue={values.executive_id ?? ""} className="input">
            <option value="">Todos</option>
            {executives.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="field-label">Cliente</label>
        <input name="client" defaultValue={values.client ?? ""} className="input" placeholder="Buscar cliente" />
      </div>
      <div>
        <label className="field-label">Tipo de Oportunidade</label>
        <select name="opportunity_type" defaultValue={values.opportunity_type ?? ""} className="input">
          <option value="">Todos</option>
          {opportunityTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Tipo de Receita</label>
        <select name="revenue_type" defaultValue={values.revenue_type ?? ""} className="input">
          <option value="">Todos</option>
          {Object.entries(REVENUE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Status</label>
        <select name="status" defaultValue={values.status ?? ""} className="input">
          <option value="">Todos</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Previsão de</label>
          <input type="date" name="from" defaultValue={values.from ?? ""} className="input" />
        </div>
        <div>
          <label className="field-label">até</label>
          <input type="date" name="to" defaultValue={values.to ?? ""} className="input" />
        </div>
      </div>
    </div>
  );
}

export default function FilterBar({
  basePath,
  values,
  opportunityTypes,
  executives,
}: {
  basePath: string;
  values: FilterValues;
  opportunityTypes: string[];
  executives?: { id: number; name: string }[];
}) {
  const hasFilters = Object.values(values).some(Boolean);

  return (
    <div className="mb-4">
      <div className="mobile-filter-toggle mb-3">
        <input type="checkbox" id="filters-toggle" className="peer sr-only" />
        <label htmlFor="filters-toggle" className="btn btn-secondary w-full justify-center">
          Filtros {hasFilters ? "(ativos)" : ""}
        </label>
        <div id="filters-drawer">
          <label htmlFor="filters-toggle" className="absolute inset-0" aria-hidden />
          <div className="drawer-panel">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Filtros</span>
              <label htmlFor="filters-toggle" className="cursor-pointer text-sm text-slate-500">
                Fechar
              </label>
            </div>
            <form method="get" action={basePath} className="flex flex-col gap-3">
              <Fields values={values} opportunityTypes={opportunityTypes} executives={executives} />
              <div className="mt-2 flex gap-2">
                <button className="btn btn-primary flex-1" type="submit">
                  Aplicar
                </button>
                {hasFilters && (
                  <a href={basePath} className="btn btn-secondary flex-1 text-center">
                    Limpar
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <form method="get" action={basePath} className="desktop-filters card p-4">
        <Fields values={values} opportunityTypes={opportunityTypes} executives={executives} />
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary" type="submit">
            Aplicar filtros
          </button>
          {hasFilters && (
            <a href={basePath} className="btn btn-secondary">
              Limpar filtros
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
