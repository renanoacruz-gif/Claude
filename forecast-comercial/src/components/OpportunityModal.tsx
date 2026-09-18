import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { createOpportunityAction, updateOpportunityAction } from "@/actions/opportunities";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  REVENUE_LABEL,
  STATUS_LABEL,
  STATUS_ORDER,
  type ForecastSnapshot,
  type OpportunityWithExecutive,
} from "@/lib/types";

function Overlay({ closeHref, children }: { closeHref: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-12 sm:pt-20">
      <Link href={closeHref} className="absolute inset-0" aria-label="Fechar" />
      <div className="card relative max-h-[85vh] w-full max-w-lg overflow-y-auto p-6">
        <Link
          href={closeHref}
          className="absolute right-4 top-4 text-sm font-medium text-slate-400 hover:text-slate-700"
        >
          Fechar
        </Link>
        {children}
      </div>
    </div>
  );
}

export function OpportunityFormModal({
  mode,
  opportunity,
  opportunityTypes,
  executiveName,
  closeHref,
  returnTo,
  errorCode,
}: {
  mode: "new" | "edit";
  opportunity?: OpportunityWithExecutive;
  opportunityTypes: string[];
  executiveName: string;
  closeHref: string;
  returnTo: string;
  errorCode?: string;
}) {
  const action = mode === "new" ? createOpportunityAction : updateOpportunityAction;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Overlay closeHref={closeHref}>
      <h2 className="text-lg font-semibold text-slate-900">
        {mode === "new" ? "Nova Oportunidade" : "Editar Oportunidade"}
      </h2>
      <p className="mt-0.5 text-sm text-slate-500">Executivo responsável: {executiveName}</p>

      {errorCode && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorCode === "campos"
            ? "Preencha todos os campos obrigatórios."
            : "Não é possível excluir uma oportunidade já vendida ou perdida."}
        </p>
      )}

      <form action={action} className="mt-4 flex flex-col gap-3">
        {mode === "edit" && opportunity && <input type="hidden" name="id" value={opportunity.id} />}
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label className="field-label">Cliente *</label>
          <input
            name="client"
            required
            defaultValue={opportunity?.client}
            className="input"
            placeholder="Ex.: Tecno Medical"
          />
        </div>
        <div>
          <label className="field-label">Descrição da oportunidade *</label>
          <input
            name="description"
            required
            defaultValue={opportunity?.description}
            className="input"
            placeholder="Ex.: Migração para Cloud"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Tipo *</label>
            <select name="opportunity_type" required defaultValue={opportunity?.opportunity_type ?? ""} className="input">
              <option value="" disabled>
                Selecione
              </option>
              {opportunityTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Tipo de Receita *</label>
            <select name="revenue_type" required defaultValue={opportunity?.revenue_type ?? "recorrente"} className="input">
              {Object.entries(REVENUE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Valor (R$) *</label>
            <input
              name="value"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={opportunity?.value}
              className="input"
            />
          </div>
          <div>
            <label className="field-label">Previsão de Fechamento *</label>
            <input
              name="expected_close_date"
              type="date"
              required
              defaultValue={opportunity?.expected_close_date ?? today}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="field-label">Status *</label>
          <select name="status" required defaultValue={opportunity?.status ?? "previsao"} className="input">
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Observações</label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={opportunity?.notes ?? ""}
            className="input"
            placeholder="Proposta apresentada, aguardando retorno do cliente."
          />
        </div>
        <div className="mt-2 flex gap-2">
          <button className="btn btn-primary flex-1" type="submit">
            {mode === "new" ? "Salvar oportunidade" : "Salvar alterações"}
          </button>
          <Link href={closeHref} className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </Overlay>
  );
}

export function OpportunityDetailModal({
  opportunity,
  snapshots,
  closeHref,
  editHref,
  canManage,
}: {
  opportunity: OpportunityWithExecutive;
  snapshots: ForecastSnapshot[];
  closeHref: string;
  editHref: string;
  canManage: boolean;
}) {
  return (
    <Overlay closeHref={closeHref}>
      <div className="flex items-start justify-between gap-3 pr-10">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{opportunity.description}</h2>
          <p className="text-sm text-slate-500">{opportunity.client}</p>
        </div>
        <StatusBadge status={opportunity.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Executivo</dt>
          <dd className="font-medium text-slate-900">{opportunity.executive_name}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Valor</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(opportunity.value)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Tipo</dt>
          <dd className="font-medium text-slate-900">{opportunity.opportunity_type}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Receita</dt>
          <dd className="font-medium text-slate-900">{REVENUE_LABEL[opportunity.revenue_type]}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">Observações</dt>
          <dd className="font-medium text-slate-900">{opportunity.notes || "—"}</dd>
        </div>
      </dl>

      {canManage && (
        <Link href={editHref} className="btn btn-primary mt-4">
          Editar oportunidade
        </Link>
      )}

      {snapshots.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Histórico de reportes
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {snapshots.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-500">{formatDateTime(s.created_at)}</span>
                <StatusBadge status={s.status} />
                <span className="font-medium text-slate-900">{formatCurrency(s.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Overlay>
  );
}
