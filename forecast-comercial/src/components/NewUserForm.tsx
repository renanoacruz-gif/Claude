"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "@/actions/users";

const initialState: CreateUserState = {};

export default function NewUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={action} className="card flex flex-col gap-3 p-5">
      <p className="text-sm font-semibold text-slate-800">Convidar novo usuário</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label">Nome</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="field-label">E-mail</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="field-label">Senha provisória</label>
          <input name="password" type="password" required minLength={6} className="input" />
        </div>
        <div>
          <label className="field-label">Perfil</label>
          <select name="role" className="input" defaultValue="executive">
            <option value="executive">Executivo de Soluções e Negócios</option>
            <option value="manager">Coordenador / Gerente</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn btn-primary self-start" type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar usuário"}
      </button>
    </form>
  );
}
