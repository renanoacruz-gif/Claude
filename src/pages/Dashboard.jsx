import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTarefas } from '../hooks/useTarefas'
import { useDatasEspeciais } from '../hooks/useDatasEspeciais'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import TarefaCard from '../components/TarefaCard'
import DatasEspeciaisCard from '../components/DatasEspeciaisCard'
import Modal from '../components/Modal'
import { tarefasDeHoje, ordenarPorPrioridade } from '../utils/ordenarTarefas'
import { diasAteProximaOcorrencia } from '../utils/formatarData'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Saudação baseada no horário
function saudacao(nome) {
  const hora = new Date().getHours()
  let cumprimento = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
  if (nome) {
    const primeiroNome = nome.split(' ')[0]
    return `${cumprimento}, ${primeiroNome}! 👋`
  }
  return `${cumprimento}! 👋`
}

// Formulário rápido de nova tarefa
function FormNovaTarefa({ onSalvar, onFechar }) {
  const [titulo, setTitulo] = useState('')
  const [dataLimite, setDataLimite] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    await onSalvar({ titulo: titulo.trim(), data_limite: dataLimite || null })
    onFechar()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="rotulo">Título da tarefa *</label>
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
        <button type="submit" className="botao-primario flex-1" disabled={!titulo.trim()}>
          Criar tarefa
        </button>
      </div>
    </form>
  )
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const { tarefas, concluir, criar } = useTarefas(usuario?.id)
  const { datas } = useDatasEspeciais(usuario?.id)
  const [modalAberto, setModalAberto] = useState(false)

  // Tarefas de hoje e atrasadas (máx. 5)
  const tarefasHoje = ordenarPorPrioridade(tarefasDeHoje(tarefas)).slice(0, 5)

  // Próximos aniversários/eventos nos próximos 30 dias
  const proximasOcorrencias = datas
    .map(d => ({ ...d, diasAte: diasAteProximaOcorrencia(d.data, d.recorrente) }))
    .filter(d => d.diasAte !== null && d.diasAte <= 30)
    .sort((a, b) => a.diasAte - b.diasAte)
    .slice(0, 3)

  const dataHoje = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="px-4 pt-5 pb-24 space-y-6 area-segura-inferior">
        {/* Saudação */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 leading-tight">
            {saudacao(usuario?.user_metadata?.full_name || usuario?.email)}
          </h2>
          <p className="text-slate-400 text-sm mt-1 capitalize">{dataHoje}</p>
        </section>

        {/* Tarefas de hoje */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-200">
              📋 Tarefas de hoje
              {tarefasHoje.length > 0 && (
                <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  {tarefasHoje.length}
                </span>
              )}
            </h3>
            <Link to="/tarefas" className="text-xs text-indigo-400 hover:text-indigo-300">
              Ver todas →
            </Link>
          </div>

          {tarefasHoje.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-slate-300 font-medium text-sm">Nenhuma tarefa pendente!</p>
              <p className="text-slate-500 text-xs mt-1">Aproveite o dia</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tarefasHoje.map(t => (
                <TarefaCard
                  key={t.id}
                  tarefa={t}
                  onConcluir={concluir}
                  onEditar={() => {}}
                  onExcluir={() => {}}
                />
              ))}
            </div>
          )}
        </section>

        {/* Próximas datas especiais */}
        {proximasOcorrencias.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-200">🎂 Em breve</h3>
              <Link to="/datas" className="text-xs text-indigo-400 hover:text-indigo-300">
                Ver todas →
              </Link>
            </div>
            <div className="space-y-2">
              {proximasOcorrencias.map(d => (
                <DatasEspeciaisCard
                  key={d.id}
                  data={d}
                  onEditar={() => {}}
                  onExcluir={() => {}}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FAB — adicionar tarefa rápida */}
      <button
        onClick={() => setModalAberto(true)}
        className="fab"
        aria-label="Adicionar tarefa"
      >
        +
      </button>

      <BottomNav />

      {/* Modal rápido de nova tarefa */}
      <Modal
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        titulo="Nova tarefa"
      >
        <FormNovaTarefa
          onSalvar={criar}
          onFechar={() => setModalAberto(false)}
        />
      </Modal>
    </div>
  )
}
