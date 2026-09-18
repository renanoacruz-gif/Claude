export type Role = "executive" | "manager" | "admin";

export type OpportunityStatus =
  | "previsao"
  | "assinatura"
  | "vendido"
  | "perdida";

export type RevenueType = "recorrente" | "nao_recorrente";

export const STATUS_LABEL: Record<OpportunityStatus, string> = {
  previsao: "Previsão de Fechamento",
  assinatura: "Em Assinatura",
  vendido: "Venda Concretizada",
  perdida: "Perdida",
};

export const STATUS_ORDER: OpportunityStatus[] = [
  "previsao",
  "assinatura",
  "vendido",
  "perdida",
];

export const REVENUE_LABEL: Record<RevenueType, string> = {
  recorrente: "Recorrente (MRR)",
  nao_recorrente: "Não Recorrente",
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: number;
  client: string;
  description: string;
  executive_id: number;
  opportunity_type: string;
  revenue_type: RevenueType;
  value: number;
  status: OpportunityStatus;
  expected_close_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunityWithExecutive extends Opportunity {
  executive_name: string;
}

export interface ForecastSnapshot {
  id: number;
  opportunity_id: number;
  executive_id: number;
  report_date: string;
  client: string;
  description: string;
  value: number;
  status: OpportunityStatus;
  expected_close_date: string;
  created_at: string;
}

export interface SheetsConnection {
  id: number;
  executive_id: number;
  spreadsheet_id: string;
  sheet_name: string;
  last_sync_at: string | null;
  status: "conectado" | "erro" | "nunca_sincronizado";
}

export interface OpportunityFilters {
  executiveId?: number;
  client?: string;
  opportunityType?: string;
  revenueType?: RevenueType | "";
  status?: OpportunityStatus | "";
  from?: string;
  to?: string;
}
