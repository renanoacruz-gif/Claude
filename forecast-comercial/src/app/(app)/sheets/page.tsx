import { requireRole } from "@/lib/dal";
import { getSheetsConnection } from "@/lib/db";
import { saveSheetsConnectionAction, syncSheetsAction } from "@/actions/sheets";
import { formatDateTime } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  conectado: "Conectado",
  erro: "Erro na última sincronização",
  nunca_sincronizado: "Nunca sincronizado",
};

export default async function SheetsPage() {
  const user = await requireRole("executive");
  const connection = getSheetsConnection(user.id);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Integração com Google Sheets</h1>
        <p className="text-sm text-slate-500">
          Conecte sua própria planilha para importar oportunidades automaticamente para o seu forecast.
        </p>
      </div>

      <div className="card mb-4 p-5">
        <form action={saveSheetsConnectionAction} className="flex flex-col gap-3">
          <div>
            <label className="field-label">ID da planilha (Spreadsheet ID)</label>
            <input
              name="spreadsheet_id"
              className="input"
              defaultValue={connection?.spreadsheet_id}
              placeholder="Ex.: 1AbCdEfGhIjKlMnOpQrStUvWxYz"
            />
            <p className="mt-1 text-xs text-slate-400">
              Está na URL da planilha: docs.google.com/spreadsheets/d/<b>ID</b>/edit
            </p>
          </div>
          <div>
            <label className="field-label">Nome da aba (opcional)</label>
            <input name="sheet_name" className="input" defaultValue={connection?.sheet_name} placeholder="Forecast" />
          </div>
          <button className="btn btn-primary self-start" type="submit">
            Salvar conexão
          </button>
        </form>
      </div>

      {connection && (
        <div className="card mb-4 flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium text-slate-900">{STATUS_LABEL[connection.status]}</p>
            <p className="text-xs text-slate-500">
              Última sincronização: {connection.last_sync_at ? formatDateTime(connection.last_sync_at) : "—"}
            </p>
          </div>
          <form action={syncSheetsAction}>
            <button className="btn btn-secondary" type="submit">
              Sincronizar agora
            </button>
          </form>
        </div>
      )}

      <div className="card p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Como preparar sua planilha</p>
        <p className="mt-2">
          Compartilhe a planilha como &quot;Qualquer pessoa com o link pode visualizar&quot; e use estas colunas no
          cabeçalho (nomes em português ou inglês são aceitos):
        </p>
        <p className="mt-2 rounded-md bg-slate-50 p-3 font-mono text-xs">
          Cliente · Oportunidade · Tipo · Receita · Valor · Status · Previsão · Observações
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Nesta versão a importação é feita via exportação pública em CSV, sem exigir login Google — não é
          necessário nenhuma credencial. Sincronização bidirecional e planilhas privadas exigem credenciais OAuth do
          Google Cloud, que podem ser adicionadas futuramente sem alterar o restante da arquitetura.
        </p>
      </div>
    </div>
  );
}
