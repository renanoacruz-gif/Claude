import { requireRole } from "@/lib/dal";
import { listExecutives, listSnapshots } from "@/lib/db";
import { str, type SearchParams } from "@/lib/query";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default async function GestorHistoricoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole("manager", "admin");
  const sp = await searchParams;
  const executiveId = str(sp.executive_id);
  const executives = listExecutives();
  const execMap = new Map(executives.map((e) => [e.id, e.name]));

  const snapshots = listSnapshots({ executiveId: executiveId ? Number(executiveId) : undefined });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Histórico de Forecast da Equipe</h1>
        <p className="text-sm text-slate-500">Compare o que mudou entre reportes de qualquer Executivo.</p>
      </div>

      <form method="get" className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="field-label">Executivo</label>
          <select name="executive_id" defaultValue={executiveId ?? ""} className="input">
            <option value="">Todos</option>
            {executives.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Filtrar
        </button>
        {executiveId && (
          <a href="/gestor/historico" className="btn btn-secondary">
            Limpar
          </a>
        )}
      </form>

      {snapshots.length === 0 ? (
        <EmptyState title="Nenhum histórico encontrado." description="Ajuste o filtro de Executivo." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Data do reporte</th>
                  <th>Executivo</th>
                  <th>Cliente</th>
                  <th>Oportunidade</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Previsão</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.slice(0, 300).map((s) => (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap text-xs text-slate-500">{formatDateTime(s.created_at)}</td>
                    <td>{execMap.get(s.executive_id) ?? "—"}</td>
                    <td>{s.client}</td>
                    <td>{s.description}</td>
                    <td className="font-medium">{formatCurrency(s.value)}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="whitespace-nowrap">{formatDate(s.expected_close_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
