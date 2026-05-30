import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDatasEspeciais } from '../hooks/useDatasEspeciais'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import DatasEspeciaisCard from '../components/DatasEspeciaisCard'
import Modal from '../components/Modal'
import { diasAteProximaOcorrencia } from '../utils/formatarData'

// Formulário de criação/edição de data especial
function FormData({ data, onSalvar, onFechar }) {
  const [nome, setNome] = useState(data?.nome || '')
  const [dataValor, setDataValor] = useState(data?.data?.slice(0, 10) || '')
  const [tipo, setTipo] = useState(data?.tipo || 'aniversario')
  const [recorrente, setRecorrente] = useState(data?.recorrente ?? true)
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !dataValor) return
    setSalvando(true)
    try {
      await onSalvar({
        nome: nome.trim(),
        data: dataValor,
        tipo,
        recorrente,
      })
      onFechar()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="rotulo">Nome *</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Aniversário da Mamãe"
          className="campo-texto"
          autoFocus
          required
        />
      </div>

      <div>
        <label className="rotulo">Data *</label>
        <input
          type="date"
          value={dataValor}
          onChange={e => setDataValor(e.target.value)}
          className="campo-texto"
          required
        />
      </div>

      <div>
        <label className="rotulo">Tipo</label>
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="campo-texto"
        >
          <option value="aniversario">🎂 Aniversário</option>
          <option value="evento">📅 Evento</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setRecorrente(!recorrente)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              recorrente ? 'bg-indigo-600' : 'bg-slate-600'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                recorrente ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm text-slate-300">Repetir todo ano</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onFechar} className="botao-secundario flex-1">
          Cancelar
        </button>
        <button
          type="submit"
          className="botao-primario flex-1"
          disabled={!nome.trim() || !dataValor || salvando}
        >
          {salvando ? 'Salvando...' : data ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}

export default function DatasEspeciais() {
  const { usuario } = useAuth()
  const { datas, carregando, criar, atualizar, excluir } = useDatasEspeciais(usuario?.id)
  const [modalAberto, setModalAberto] = useState(false)
  const [dataEditando, setDataEditando] = useState(null)

  // Ordena por proximidade da próxima ocorrência
  const datasOrdenadas = [...datas].sort((a, b) => {
    const diasA = diasAteProximaOcorrencia(a.data, a.recorrente) ?? Infinity
    const diasB = diasAteProximaOcorrencia(b.data, b.recorrente) ?? Infinity
    return diasA - diasB
  })

  function abrirEdicao(data) {
    setDataEditando(data)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setDataEditando(null)
  }

  async function handleSalvar(dados) {
    if (dataEditando) {
      await atualizar(dataEditando.id, dados)
    } else {
      await criar(dados)
    }
  }

  async function handleExcluir(id) {
    if (confirm('Excluir esta data especial?')) {
      await excluir(id)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header titulo="Datas Especiais" />

      <main className="px-4 pt-4 pb-24 space-y-2 area-segura-inferior">
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : datasOrdenadas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎂</p>
            <p className="text-slate-300 font-medium">Nenhuma data especial</p>
            <p className="text-slate-500 text-sm mt-1">
              Adicione aniversários e eventos importantes
            </p>
          </div>
        ) : (
          datasOrdenadas.map(d => (
            <DatasEspeciaisCard
              key={d.id}
              data={d}
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
        aria-label="Adicionar data especial"
      >
        +
      </button>

      <BottomNav />

      <Modal
        aberto={modalAberto}
        fechar={fecharModal}
        titulo={dataEditando ? 'Editar data' : 'Nova data especial'}
      >
        <FormData
          data={dataEditando}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      </Modal>
    </div>
  )
}
