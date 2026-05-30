import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'

export default function Configuracoes() {
  const { usuario, sair } = useAuth()

  const nomeCompleto = usuario?.user_metadata?.full_name ?? usuario?.email ?? 'Usuário'
  const email = usuario?.email ?? ''
  const avatarUrl = usuario?.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header titulo="Configurações" />

      <div className="px-4 pt-6 space-y-6">
        {/* Perfil */}
        <section className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nomeCompleto}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl flex-shrink-0">
              {nomeCompleto[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-base truncate">{nomeCompleto}</p>
            <p className="text-slate-400 text-sm truncate">{email}</p>
          </div>
        </section>

        {/* Informações do app */}
        <section className="bg-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sobre</p>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-slate-300 text-sm">Versão</span>
            <span className="text-slate-500 text-sm">0.1.0 MVP</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-slate-700/50">
            <span className="text-slate-300 text-sm">Fase</span>
            <span className="text-slate-500 text-sm">Fase 1 — MVP</span>
          </div>
        </section>

        {/* Sair */}
        <section>
          <button
            onClick={sair}
            className="w-full bg-red-900/30 hover:bg-red-900/50 active:bg-red-900/70 border border-red-800/50 text-red-400 font-semibold py-4 rounded-2xl transition-colors"
          >
            Sair da conta
          </button>
        </section>
      </div>
    </div>
  )
}
