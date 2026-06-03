"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/products", label: "Produtos", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1e293b] flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-white font-bold text-xl">ClientDash</h1>
        <p className="text-slate-400 text-xs mt-0.5">Gestão de Produtos</p>
      </div>
      <nav className="flex-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
