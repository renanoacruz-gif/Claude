import { diasAteProximaOcorrencia, formatarData } from '../utils/formatarData'

// Badge de tipo da data especial
function TipoBadge({ tipo }) {
  if (tipo === 'aniversario') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">
        🎂 Aniversário
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
      📅 Evento
    </span>
  )
}

// Card de data especial com contagem regressiva
export default function DatasEspeciaisCard({ data, onEditar, onExcluir }) {
  const dias = diasAteProximaOcorrencia(data.data, data.recorrente)

  let textoContagem = ''
  if (dias === 0) textoContagem = 'Hoje! 🎉'
  else if (dias === 1) textoContagem = 'Amanhã!'
  else if (dias !== null) textoContagem = `Em ${dias} dia${dias > 1 ? 's' : ''}`

  const corContagem =
    dias === 0
      ? 'text-green-400'
      : dias !== null && dias <= 7
      ? 'text-yellow-400'
      : 'text-slate-400'

  return (
    <div className="card p-4 flex items-center gap-3">
      {/* Ícone */}
      <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">
        {data.tipo === 'aniversario' ? '🎂' : '📅'}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-100 text-sm leading-tight truncate">
          {data.nome}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <TipoBadge tipo={data.tipo} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{formatarData(data.data)}</span>
          {textoContagem && (
            <span className={`text-xs font-semibold ${corContagem}`}>
              · {textoContagem}
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          onClick={() => onEditar(data)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          aria-label="Editar data"
        >
          ✏️
        </button>
        <button
          onClick={() => onExcluir(data.id)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/30 active:bg-red-900/50 transition-colors"
          aria-label="Excluir data"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
