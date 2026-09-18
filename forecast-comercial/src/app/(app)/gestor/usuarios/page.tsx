import { requireRole } from "@/lib/dal";
import { listUsers } from "@/lib/db";
import { toggleUserActiveAction } from "@/actions/users";
import { ROLE_LABEL } from "@/lib/role-label";
import NewUserForm from "@/components/NewUserForm";
import { formatDate } from "@/lib/format";

export default async function GestorUsuariosPage() {
  await requireRole("manager", "admin");
  const users = listUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Usuários</h1>
        <p className="text-sm text-slate-500">Gerencie os Executivos e Gestores com acesso ao sistema.</p>
      </div>

      <div className="mb-6">
        <NewUserForm />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Desde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABEL[u.role]}</td>
                  <td>
                    <span className={`badge ${u.active ? "bg-status-vendido-bg text-status-vendido-fg" : "bg-status-perdida-bg text-status-perdida-fg"}`}>
                      {u.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-xs text-slate-500">{formatDate(u.created_at)}</td>
                  <td className="text-right">
                    <form action={toggleUserActiveAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="active" value={u.active ? "0" : "1"} />
                      <button className="text-xs font-medium text-brand-600 hover:underline" type="submit">
                        {u.active ? "Desativar" : "Ativar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
