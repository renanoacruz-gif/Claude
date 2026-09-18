import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { deleteOpportunityAction } from "@/actions/opportunities";
import { formatCurrency, formatDate } from "@/lib/format";
import { REVENUE_LABEL, type OpportunityWithExecutive } from "@/lib/types";

export default function OpportunityTable({
  opportunities,
  showExecutive = false,
  canManage,
  basePath,
  returnTo,
}: {
  opportunities: OpportunityWithExecutive[];
  showExecutive?: boolean;
  canManage: (opp: OpportunityWithExecutive) => boolean;
  basePath: string;
  returnTo: string;
}) {
  const total = opportunities.reduce((sum, o) => sum + o.value, 0);

  return (
    <div className="card overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="table-modern">
          <thead>
            <tr>
              {showExecutive && <th>Executivo</th>}
              <th>Cliente</th>
              <th>Oportunidade</th>
              <th>Tipo</th>
              <th>Receita</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Previsão</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((o) => (
              <tr key={o.id}>
                {showExecutive && <td>{o.executive_name}</td>}
                <td>{o.client}</td>
                <td>
                  <Link href={`${basePath}?view=${o.id}`} className="text-brand-600 hover:underline">
                    {o.description}
                  </Link>
                </td>
                <td>{o.opportunity_type}</td>
                <td className="whitespace-nowrap text-xs text-slate-500">
                  {REVENUE_LABEL[o.revenue_type]}
                </td>
                <td className="font-medium">{formatCurrency(o.value)}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td className="whitespace-nowrap">{formatDate(o.expected_close_date)}</td>
                <td className="whitespace-nowrap text-right">
                  {canManage(o) && (
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`${basePath}?edit=${o.id}`}
                        className="text-xs font-medium text-brand-600 hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={deleteOpportunityAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <button
                          className="text-xs font-medium text-red-600 hover:underline"
                          type="submit"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {opportunities.map((o) => (
          <div key={o.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{o.client}</p>
                <Link href={`${basePath}?view=${o.id}`} className="text-sm text-brand-600 hover:underline">
                  {o.description}
                </Link>
                {showExecutive && <p className="text-xs text-slate-500">{o.executive_name}</p>}
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{o.opportunity_type}</span>
              <span>{REVENUE_LABEL[o.revenue_type]}</span>
              <span>Previsão: {formatDate(o.expected_close_date)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base font-semibold text-slate-900">{formatCurrency(o.value)}</span>
              {canManage(o) && (
                <div className="flex gap-3">
                  <Link href={`${basePath}?edit=${o.id}`} className="text-xs font-medium text-brand-600">
                    Editar
                  </Link>
                  <form action={deleteOpportunityAction}>
                    <input type="hidden" name="id" value={o.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button className="text-xs font-medium text-red-600" type="submit">
                      Excluir
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {opportunities.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
          <span className="text-slate-500">{opportunities.length} oportunidade(s)</span>
          <span className="font-semibold text-slate-900">Total: {formatCurrency(total)}</span>
        </div>
      )}
    </div>
  );
}
