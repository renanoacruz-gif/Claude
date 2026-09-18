"use client";

import { useActionState } from "react";
import Link from "next/link";
import { recoverAction, type RecoverState } from "@/actions/auth";

const initialState: RecoverState = {};

export default function RecoverPage() {
  const [state, action, pending] = useActionState(recoverAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-lg font-semibold text-slate-900">Recuperar acesso</h1>
        <p className="mt-1 text-sm text-slate-500">
          Informe seu e-mail corporativo. Enviaremos instruções para redefinir sua senha.
        </p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="field-label">E-mail</label>
            <input name="email" type="email" required autoFocus className="input" />
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={pending}>
            {pending ? "Enviando..." : "Enviar instruções"}
          </button>
          {state?.message && (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>
          )}
        </form>

        <Link href="/login" className="mt-4 inline-block text-sm text-brand-600 hover:underline">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
