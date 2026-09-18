import { requireUser } from "@/lib/dal";
import { ROLE_LABEL } from "@/lib/role-label";

export default async function ConfiguracoesPage() {
  const user = await requireUser();

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Configurações</h1>
      <div className="card p-5">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Nome</dt>
            <dd className="font-medium text-slate-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd className="font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Perfil</dt>
            <dd className="font-medium text-slate-900">{ROLE_LABEL[user.role]}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
