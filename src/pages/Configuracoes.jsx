import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useState } from 'react'

// Linha de configuração com toggle
function LinhaToggle({ rotulo, descricao, ativo, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-700/50">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-slate-200">{rotulo}</p>
        {descricao && <p className="text-xs text-slate-500 mt-0.5">{descricao}</p>}
      </div>
      <button
        onClick={() => onChange(!ativo)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          ativo ? 'bg-indigo-600' : 'bg-slate-600'
        }`}
        role="switch"
        aria-checked={ativo}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            ativo ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

// Seção de configurações com título
function SecaoConfiguracoes({ titulo, children }) {
  return (
    <section className="card px-4 py-2">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">
        {titulo}
      </h3>
      {children}
    </section>
  )
}

export default function Configuracoes() {
  const { usuario, sair } = useAuth()
  const [notificacoes, setNotificacoes] = useState(false)
  const [saindo, setSaindo] = useState(false)

  const nomeCompleto = usuario?.user_metadata?.full_name || 'Usuário'
  const email = usuario?.email || ''
  const avatarUrl = usuario?.user_metadata?.avatar_url

  async function handleSair() {
    if (!confirm('Tem certeza que quer sair?')) return
    setSaindo(true)
    try {
      await sair()
    } catch {
      setSaindo(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header titulo="Configurações" />

      <main className="px-4 pt-5 pb-24 space-y-4 area-segura-inferior">
        {/* Perfil do usuário */}
        <div className="card p-5 flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nomeCompleto}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/50"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-indigo-500/50">
              {nomeCompleto.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-100 text-base truncate">{nomeCompleto}</p>
            <p className="text-sm text-slate-400 truncate">{email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mt-1">
              ● Conectado
            </span>
          </div>
        </div>

        {/* Notificações */}
        <SecaoConfiguracoes titulo="Notificações">
          <LinhaToggle
            rotulo="Notificações ativas"
            descricao="Receber lembretes de tarefas e datas"
            ativo={notificacoes}
            onChange={setNotificacoes}
          />
        </SecaoConfiguracoes>

        {/* Sobre */}
        <SecaoConfiguracoes titulo="Sobre">
          <div className="py-3 border-b border-slate-700/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Versão do app</span>
              <span className="text-sm text-slate-500">0.1.0</span>
            </div>
          </div>
          <div className="py-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Sistema</span>
              <span className="text-sm text-slate-500">SO da Vida</span>
            </div>
          </div>
        </SecaoConfiguracoes>

        {/* Logout */}
        <button
          onClick={handleSair}
          disabled={saindo}
          className="botao-perigo w-full disabled:opacity-60"
        >
          {saindo ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saindo...
            </>
          ) : (
            <>
              🚪 Sair da conta
            </>
          )}
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
