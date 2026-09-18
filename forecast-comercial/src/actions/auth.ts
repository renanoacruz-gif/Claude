"use server";

import { redirect } from "next/navigation";
import { getUserByEmail, verifyPassword } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const user = getUserByEmail(email);
  if (!user || !user.active || !verifyPassword(user, password)) {
    return { error: "E-mail ou senha inválidos." };
  }

  await createSession({ userId: user.id, name: user.name, email: user.email, role: user.role });
  redirect(user.role === "executive" ? "/dashboard" : "/gestor");
}

export async function logoutAction() {
  "use server";
  await deleteSession();
  redirect("/login");
}

export interface RecoverState {
  message?: string;
}

export async function recoverAction(_prev: RecoverState | undefined, formData: FormData): Promise<RecoverState> {
  const email = String(formData.get("email") ?? "").trim();
  void email;
  // MVP: nenhum provedor de e-mail está configurado neste ambiente; a mensagem é
  // deliberadamente genérica para não confirmar quais e-mails existem na base.
  return {
    message:
      "Se o e-mail informado estiver cadastrado, enviaremos as instruções de acesso em instantes.",
  };
}
