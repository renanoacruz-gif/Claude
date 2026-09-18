import { requireRole } from "@/lib/dal";
import { listSnapshots } from "@/lib/db";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export default async function HistoricoPage() {
  const user = await requireRole("executive");
  const snapshots = listSnapshots({ executiveId: user.id });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Histórico dos meus reportes</h1>
        <p className="text-sm text-slate-500">
          Cada alteração salva em uma oportunidade gera um registro permanente, preservando o forecast de cada período.
        </p>
      </div>

      {snapshots.length === 0 ? (
        <EmptyState
          title="Nenhum histórico ainda."
          description="Assim que você cadastrar ou atualizar oportunidades, os reportes aparecerão aqui."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Data do reporte</th>
                  <th>Cliente</th>
                  <th>Oportunidade</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Previsão</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap text-xs text-slate-500">{formatDateTime(s.created_at)}</td>
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
