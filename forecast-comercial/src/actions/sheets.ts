"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import {
  createOpportunity,
  findOpportunityByClientAndDescription,
  getSheetsConnection,
  markSheetsSync,
  updateOpportunity,
  upsertSheetsConnection,
} from "@/lib/db";
import type { OpportunityStatus, RevenueType } from "@/lib/types";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

const HEADER_ALIASES: Record<string, string> = {
  cliente: "client",
  client: "client",
  oportunidade: "description",
  descricao: "description",
  "descrição": "description",
  description: "description",
  tipo: "opportunity_type",
  "tipo de oportunidade": "opportunity_type",
  opportunity_type: "opportunity_type",
  receita: "revenue_type",
  "tipo de receita": "revenue_type",
  revenue_type: "revenue_type",
  valor: "value",
  value: "value",
  status: "status",
  previsao: "expected_close_date",
  "previsão": "expected_close_date",
  "previsao de fechamento": "expected_close_date",
  "data prevista": "expected_close_date",
  expected_close_date: "expected_close_date",
  observacoes: "notes",
  "observações": "notes",
  notes: "notes",
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase();
}

function normalizeStatus(raw: string): OpportunityStatus {
  const v = raw.trim().toLowerCase();
  if (v.includes("assinatura")) return "assinatura";
  if (v.includes("vend") || v.includes("concretiz")) return "vendido";
  if (v.includes("perd")) return "perdida";
  return "previsao";
}

function normalizeRevenue(raw: string): RevenueType {
  const v = raw.trim().toLowerCase();
  if (v.includes("nao") || v.includes("não")) return "nao_recorrente";
  return "recorrente";
}

function normalizeValue(raw: string): number {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3},)/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function normalizeDate(raw: string): string {
  const v = raw.trim();
  const br = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  return v;
}

export async function saveSheetsConnectionAction(formData: FormData) {
  const user = await requireRole("executive");
  const spreadsheetId = String(formData.get("spreadsheet_id") ?? "").trim();
  const sheetName = String(formData.get("sheet_name") ?? "").trim();
  if (spreadsheetId) {
    upsertSheetsConnection(user.id, spreadsheetId, sheetName);
  }
  revalidatePath("/sheets");
  redirect("/sheets");
}

export async function syncSheetsAction() {
  const user = await requireRole("executive");
  const connection = getSheetsConnection(user.id);
  if (!connection) redirect("/sheets");

  try {
    const url = `https://docs.google.com/spreadsheets/d/${connection!.spreadsheet_id}/gviz/tq?tqx=out:csv${
      connection!.sheet_name ? `&sheet=${encodeURIComponent(connection!.sheet_name)}` : ""
    }`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const rows = parseCsv(text);
    if (rows.length < 2) throw new Error("Planilha vazia ou sem cabeçalho.");

    const header = rows[0].map((h) => HEADER_ALIASES[normalizeHeader(h)] ?? normalizeHeader(h));
    for (const raw of rows.slice(1)) {
      const record: Record<string, string> = {};
      header.forEach((key, i) => (record[key] = raw[i] ?? ""));
      if (!record.client || !record.description) continue;

      const input = {
        client: record.client.trim(),
        description: record.description.trim(),
        executive_id: user.id,
        opportunity_type: record.opportunity_type?.trim() || "Outros",
        revenue_type: normalizeRevenue(record.revenue_type ?? ""),
        value: normalizeValue(record.value ?? "0"),
        status: normalizeStatus(record.status ?? ""),
        expected_close_date: normalizeDate(record.expected_close_date ?? ""),
        notes: record.notes?.trim() || null,
      };
      const existing = findOpportunityByClientAndDescription(user.id, input.client, input.description);
      if (existing) {
        updateOpportunity(existing.id, input);
      } else {
        createOpportunity(input);
      }
    }
    markSheetsSync(user.id, "conectado");
  } catch {
    markSheetsSync(user.id, "erro");
  }

  revalidatePath("/sheets");
  revalidatePath("/forecast");
  revalidatePath("/dashboard");
  revalidatePath("/gestor");
  redirect("/sheets");
}
