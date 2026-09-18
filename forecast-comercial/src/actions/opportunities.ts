"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, requireUser } from "@/lib/dal";
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunityById,
  updateOpportunity,
  type OpportunityInput,
} from "@/lib/db";
import type { OpportunityStatus, RevenueType } from "@/lib/types";

function parseInput(formData: FormData, executiveId: number): OpportunityInput {
  const value = Number(String(formData.get("value") ?? "0").replace(",", "."));
  return {
    client: String(formData.get("client") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    executive_id: executiveId,
    opportunity_type: String(formData.get("opportunity_type") ?? "").trim(),
    revenue_type: String(formData.get("revenue_type") ?? "recorrente") as RevenueType,
    value: Number.isFinite(value) ? value : 0,
    status: String(formData.get("status") ?? "previsao") as OpportunityStatus,
    expected_close_date: String(formData.get("expected_close_date") ?? ""),
    notes: String(formData.get("notes") ?? "") || null,
  };
}

function safeReturnTo(formData: FormData, fallback: string) {
  const returnTo = String(formData.get("returnTo") ?? "");
  return returnTo.startsWith("/") ? returnTo : fallback;
}

export async function createOpportunityAction(formData: FormData) {
  const user = await requireRole("executive");
  const input = parseInput(formData, user.id);
  if (!input.client || !input.description || !input.opportunity_type || !input.expected_close_date) {
    redirect(`${safeReturnTo(formData, "/forecast")}&error=campos`);
  }
  createOpportunity(input);
  revalidatePath("/forecast");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  revalidatePath("/gestor");
  redirect(safeReturnTo(formData, "/forecast"));
}

export async function updateOpportunityAction(formData: FormData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  const existing = getOpportunityById(id);
  if (!existing) redirect("/forecast");
  if (user.role === "executive" && existing!.executive_id !== user.id) {
    redirect("/forecast");
  }
  const input = parseInput(formData, existing!.executive_id);
  if (!input.client || !input.description || !input.opportunity_type || !input.expected_close_date) {
    redirect(`${safeReturnTo(formData, "/forecast")}&error=campos`);
  }
  updateOpportunity(id, input);
  revalidatePath("/forecast");
  revalidatePath("/dashboard");
  revalidatePath("/historico");
  revalidatePath("/gestor");
  redirect(safeReturnTo(formData, "/forecast"));
}

export async function deleteOpportunityAction(formData: FormData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  const existing = getOpportunityById(id);
  if (!existing) redirect("/forecast");
  if (user.role === "executive") {
    if (existing!.executive_id !== user.id) redirect("/forecast");
    if (existing!.status === "vendido" || existing!.status === "perdida") {
      redirect(`${safeReturnTo(formData, "/forecast")}&error=exclusao`);
    }
  }
  deleteOpportunity(id);
  revalidatePath("/forecast");
  revalidatePath("/dashboard");
  revalidatePath("/gestor");
  redirect(safeReturnTo(formData, "/forecast"));
}
