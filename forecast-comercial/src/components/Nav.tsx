import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { isManager } from "@/lib/dal";
import type { User } from "@/lib/types";

const EXECUTIVE_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/forecast", label: "Meu Forecast" },
  { href: "/historico", label: "Histórico" },
  { href: "/sheets", label: "Google Sheets" },
  { href: "/configuracoes", label: "Configurações" },
];

const MANAGER_LINKS = [
  { href: "/gestor", label: "Dashboard da Equipe" },
  { href: "/gestor/executivos", label: "Executivos" },
  { href: "/gestor/oportunidades", label: "Oportunidades" },
  { href: "/gestor/historico", label: "Histórico de Forecast" },
  { href: "/gestor/usuarios", label: "Usuários" },
];

export default function Nav({ user }: { user: User }) {
  const links = isManager(user.role) ? MANAGER_LINKS : EXECUTIVE_LINKS;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
            Forecast Comercial
          </span>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">{user.name}</span>
          <form action={logoutAction}>
            <button className="btn btn-secondary" type="submit">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
