import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTarefas } from '../hooks/useTarefas'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import TarefaCard from '../components/TarefaCard'
import Modal from '../components/Modal'
import { ordenarPorPrioridade } from '../utils/ordenarTarefas'

// Abas de filtro
const FILTROS = [
  { chave: 'pendentes', rotulo: 'Pendentes' },
  { chave: 'concluidas', rotulo: 'Concluídas' },
  { chave: 'todas', rotulo: 'Todas' },
]

// Formulário de criação/edição de tarefa
function FormTarefa({ tarefa, onSalvar, onFechar }) {
  const [titulo, setTitulo] = useState(tarefa?.titulo || '')
  const [descricao, setDescricao] = useState(tarefa?.descricao || '')
  const [dataLimite, setDataLimite] = useState(tarefa?.data_limite?.slice(0, 10) || '')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    setSalvando(true)
    try {
      await onSalvar({
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        data_limite: dataLimite || null,
      })
      onFechar()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="rotulo">Título *</label>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="campo-texto"
          autoFocus
          required
        />
      </div>

      <div>
        <label className="rotulo">Descrição</label>
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Detalhes opcionais..."
          className="campo-texto resize-none h-20"
        />
      </div>

      <div>
        <label className="rotulo">Data limite</label>
        <input
          type="date"
          value={dataLimite}
          onChange={e => setDataLimite(e.target.value)}
          className="campo-texto"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onFechar} className="botao-secundario flex-1">
          Cancelar
        </button>
        <button
          type="submit"
          className="botao-primario flex-1"
          disabled={!titulo.trim() || salvando}
        >
          {salvando ? 'Salvando...' : tarefa ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}

export default function Tarefas() {
  const { usuario } = useAuth()
  const { tarefas, carregando, criar, atualizar, excluir, concluir } = useTarefas(usuario?.id)
  const [filtro, setFiltro] = useState('pendentes')
  const [modalAberto, setModalAberto] = useState(false)
  const [tarefaEditando, setTarefaEditando] = useState(null)

  // Aplica filtro e ordena
  const tarefasFiltradas = ordenarPorPrioridade(
    tarefas.filter(t => {
      if (filtro === 'pendentes') return !t.concluida
      if (filtro === 'concluidas') return t.concluida
      return true
    })
  )

  function abrirEdicao(tarefa) {
    setTarefaEditando(tarefa)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setTarefaEditando(null)
  }

  async function handleSalvar(dados) {
    if (tarefaEditando) {
      await atualizar(tarefaEditando.id, dados)
    } else {
      await criar(dados)
    }
  }

  async function handleExcluir(id) {
    if (confirm('Excluir esta tarefa?')) {
      await excluir(id)
    }
  }

  const contadores = {
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
    todas: tarefas.length,
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header titulo="Tarefas" />

      {/* Abas de filtro */}
      <div className="flex gap-1 px-4 py-3 bg-slate-900 sticky top-14 z-20 border-b border-slate-800">
        {FILTROS.map(({ chave, rotulo }) => (
          <button
            key={chave}
            onClick={() => setFiltro(chave)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
              filtro === chave
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {rotulo}
            <span className="ml-1 opacity-70">({contadores[chave]})</span>
          </button>
        ))}
      </div>

      <main className="px-4 pt-4 pb-24 space-y-2 area-segura-inferior">
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tarefasFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">
              {filtro === 'concluidas' ? '🎯' : '📝'}
            </p>
            <p className="text-slate-300 font-medium">
              {filtro === 'pendentes'
                ? 'Nenhuma tarefa pendente!'
                : filtro === 'concluidas'
                ? 'Nenhuma tarefa concluída ainda'
                : 'Nenhuma tarefa cadastrada'}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {filtro === 'pendentes' ? 'Ótimo trabalho 🎉' : 'Use o + para adicionar'}
            </p>
          </div>
        ) : (
          tarefasFiltradas.map(t => (
            <TarefaCard
              key={t.id}
              tarefa={t}
              onConcluir={concluir}
              onEditar={abrirEdicao}
              onExcluir={handleExcluir}
            />
          ))
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setModalAberto(true)}
        className="fab"
        aria-label="Adicionar tarefa"
      >
        +
      </button>

      <BottomNav />

      <Modal
        aberto={modalAberto}
        fechar={fecharModal}
        titulo={tarefaEditando ? 'Editar tarefa' : 'Nova tarefa'}
      >
        <FormTarefa
          tarefa={tarefaEditando}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      </Modal>
    </div>
  )
}
