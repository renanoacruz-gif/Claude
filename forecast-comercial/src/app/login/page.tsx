"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-lg font-semibold text-slate-900">Forecast Comercial</h1>
        <p className="mt-1 text-sm text-slate-500">Entre com sua conta para continuar.</p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="field-label">E-mail</label>
            <input name="email" type="email" required autoFocus className="input" placeholder="voce@empresa.com" />
          </div>
          <div>
            <label className="field-label">Senha</label>
            <input name="password" type="password" required className="input" />
          </div>

          {state?.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/recuperar-acesso" className="text-brand-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <div className="mt-6 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Demo: gestor@demo.com (gestor) · ana@demo.com (executivo) · senha demo123
        </div>
      </div>
    </div>
  );
}
