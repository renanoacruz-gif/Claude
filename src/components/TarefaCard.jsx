import { formatarDataRelativa } from '../utils/formatarData'
import { parseISO, startOfDay, isBefore } from 'date-fns'

// Card de tarefa com opções de concluir, editar e excluir
export default function TarefaCard({ tarefa, onConcluir, onEditar, onExcluir }) {
  const hoje = startOfDay(new Date())
  const dataLimite = tarefa.data_limite ? startOfDay(parseISO(tarefa.data_limite)) : null
  const atrasada = dataLimite ? isBefore(dataLimite, hoje) && !tarefa.concluida : false

  return (
    <div
      className={`card p-4 flex gap-3 transition-opacity duration-200 ${
        tarefa.concluida ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onConcluir(tarefa.id, !tarefa.concluida)}
        className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-150"
        style={{
          borderColor: tarefa.concluida ? '#6366f1' : '#475569',
          backgroundColor: tarefa.concluida ? '#6366f1' : 'transparent',
        }}
        aria-label={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {tarefa.concluida && (
          <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        )}
      </button>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm leading-snug ${
            tarefa.concluida ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {tarefa.titulo}
        </p>

        {tarefa.descricao && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{tarefa.descricao}</p>
        )}

        {dataLimite && (
          <p
            className={`text-xs mt-1.5 font-medium ${
              tarefa.concluida
                ? 'text-slate-600'
                : atrasada
                ? 'text-red-400'
                : 'text-slate-400'
            }`}
          >
            {atrasada && !tarefa.concluida ? '⚠ ' : '📅 '}
            {formatarDataRelativa(tarefa.data_limite)}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          onClick={() => onEditar(tarefa)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 active:bg-slate-600 transition-colors"
          aria-label="Editar tarefa"
        >
          ✏️
        </button>
        <button
          onClick={() => onExcluir(tarefa.id)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/30 active:bg-red-900/50 transition-colors"
          aria-label="Excluir tarefa"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
