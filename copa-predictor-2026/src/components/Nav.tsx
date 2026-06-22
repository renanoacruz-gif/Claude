"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BarChart2, GitBranch, Sliders, Star, Swords } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart2 },
  { href: "/bracket", label: "Chaveamento", icon: GitBranch },
  { href: "/simulator", label: "Simulador", icon: Sliders },
  { href: "/brazil", label: "🇧🇷 Hexa", icon: Star },
  { href: "/compare", label: "Comparar", icon: Swords },
  { href: "/stats", label: "Estatísticas", icon: Trophy },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)]" style={{ background: "rgba(6,8,15,0.95)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🏆</span>
          <span className="gradient-text">Copa 2026</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                path === href
                  ? "bg-[var(--primary)] text-black"
                  : "text-[var(--muted-foreground)] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
