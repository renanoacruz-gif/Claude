"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createUser, getUserByEmail, setUserActive } from "@/lib/db";
import type { Role } from "@/lib/types";

export interface CreateUserState {
  error?: string;
}

export async function createUserAction(
  _prev: CreateUserState | undefined,
  formData: FormData
): Promise<CreateUserState> {
  await requireRole("manager", "admin");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "executive") as Role;

  if (!name || !email || password.length < 6) {
    return { error: "Preencha nome, e-mail e uma senha com ao menos 6 caracteres." };
  }
  if (getUserByEmail(email)) {
    return { error: "Já existe um usuário com este e-mail." };
  }
  createUser({ name, email, password, role });
  revalidatePath("/gestor/usuarios");
  redirect("/gestor/usuarios");
}

export async function toggleUserActiveAction(formData: FormData) {
  await requireRole("manager", "admin");
  const id = Number(formData.get("id"));
  const active = String(formData.get("active")) === "1";
  setUserActive(id, active);
  revalidatePath("/gestor/usuarios");
  redirect("/gestor/usuarios");
}
