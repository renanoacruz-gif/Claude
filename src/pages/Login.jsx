import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

// Página de login — tela cheia com botão de entrada pelo Google
export default function Login() {
  const { entrarComGoogle } = useAuth()
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleEntrar() {
    setCarregando(true)
    setErro(null)
    try {
      await entrarComGoogle()
    } catch (e) {
      setErro('Erro ao fazer login. Tente novamente.')
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      {/* Logo e nome */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/40">
          <span className="text-5xl">✦</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">SO da Vida</h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Sistema Operacional da Vida
          <br />
          <span className="text-slate-500 text-sm">Organize sua vida com intenção</span>
        </p>
      </div>

      {/* Funcionalidades */}
      <div className="w-full max-w-xs space-y-3 mb-10">
        {[
          { icone: '✅', texto: 'Gerencie suas tarefas diárias' },
          { icone: '🎂', texto: 'Nunca esqueça datas importantes' },
          { icone: '📱', texto: 'Funciona offline no celular' },
        ].map(({ icone, texto }) => (
          <div key={texto} className="flex items-center gap-3">
            <span className="text-xl">{icone}</span>
            <span className="text-slate-400 text-sm">{texto}</span>
          </div>
        ))}
      </div>

      {/* Botão de login */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleEntrar}
          disabled={carregando}
          className="w-full botao-primario text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {carregando ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <span className="text-xl">G</span>
              Entrar com Google
            </>
          )}
        </button>

        {erro && (
          <p className="text-red-400 text-sm text-center bg-red-900/20 rounded-xl px-4 py-2">
            {erro}
          </p>
        )}
      </div>

      {/* Rodapé */}
      <p className="mt-12 text-slate-600 text-xs text-center">
        Seus dados ficam seguros no Supabase
      </p>
    </div>
  )
}
