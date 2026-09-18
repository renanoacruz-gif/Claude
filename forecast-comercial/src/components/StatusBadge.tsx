import { STATUS_LABEL, type OpportunityStatus } from "@/lib/types";

const STYLES: Record<OpportunityStatus, string> = {
  previsao: "bg-status-previsao-bg text-status-previsao-fg",
  assinatura: "bg-status-assinatura-bg text-status-assinatura-fg",
  vendido: "bg-status-vendido-bg text-status-vendido-fg",
  perdida: "bg-status-perdida-bg text-status-perdida-fg",
};

export default function StatusBadge({ status }: { status: OpportunityStatus }) {
  return <span className={`badge ${STYLES[status]}`}>{STATUS_LABEL[status]}</span>;
}
