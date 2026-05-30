import { useEffect } from 'react'

// Modal estilo bottom-sheet — desliza de baixo para cima (mobile-first)
export default function Modal({ aberto, fechar, titulo, children }) {
  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Overlay escuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={fechar}
        aria-hidden="true"
      />

      {/* Conteúdo do modal */}
      <div className="relative bg-slate-800 rounded-t-3xl shadow-2xl animar-deslizar max-h-[90vh] flex flex-col">
        {/* Alça de arrastar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">{titulo}</h2>
          <button
            onClick={fechar}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto flex-1 px-5 py-4 pb-safe">
          {children}
        </div>
      </div>
    </div>
  )
}
