import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Cabeçalho mobile do aplicativo
export default function Header({ titulo, subtitulo, direita }) {
  const hoje = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sticky top-0 z-30">
      <div className="flex items-center justify-between h-14">
        {/* Título e data */}
        <div className="flex-1 min-w-0">
          {titulo ? (
            <>
              <h1 className="text-lg font-bold text-slate-100 leading-tight truncate">{titulo}</h1>
              {subtitulo && <p className="text-xs text-slate-400 capitalize truncate">{subtitulo}</p>}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-lg">✦</span>
                <span className="text-base font-bold text-slate-100">SO da Vida</span>
              </div>
              <p className="text-xs text-slate-400 capitalize">{hoje}</p>
            </>
          )}
        </div>

        {/* Slot direito opcional */}
        {direita && <div className="ml-3 flex-shrink-0">{direita}</div>}
      </div>
    </header>
  )
}
