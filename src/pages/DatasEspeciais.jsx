import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDatasEspeciais } from '../hooks/useDatasEspeciais'
import Header from '../components/Header'
import DatasEspeciaisCard from '../components/DatasEspeciaisCard'
import Modal from '../components/Modal'

const camposVazios = { nome: '', data: '', tipo: 'aniversario', recorrente: true }

export default function DatasEspeciais() {
  const { usuario } = useAuth()
  const { datas, carregando, criar, atualizar, excluir } = useDatasEspeciais(usuario?.id)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(camposVazios)
  const [editandoId, setEditandoId] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function abrirNova() {
    setForm(camposVazios)
    setEditandoId(null)
    setModalAberto(true)
  }

  function abrirEditar(data) {
    setForm({
      nome: data.nome,
      data: data.data ? data.data.slice(0, 10) : '',
      tipo: data.tipo,
      recorrente: data.recorrente ?? true,
    })
    setEditandoId(data.id)
    setModalAberto(true)
  }

  async function salvar(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.data) return
    setSalvando(true)
    try {
      const dados = {
        nome: form.nome.trim(),
        data: form.data,
        tipo: form.tipo,
        recorrente: form.recorrente,
      }
      if (editandoId) {
        await atualizar(editandoId, dados)
      } else {
        await criar({ ...dados, user_id: usuario.id })
      }
      setModalAberto(false)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header titulo="Datas especiais" />

      <div className="px-4 pt-4 space-y-2">
        {carregando ? (
          <p className="text-slate-500 text-sm text-center py-8">Carregando...</p>
        ) : datas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎂</p>
            <p className="text-slate-400 text-sm">Nenhuma data cadastrada.</p>
            <p className="text-slate-500 text-xs mt-1">Adicione aniversários e eventos.</p>
          </div>
        ) : (
          datas.map(d => (
            <DatasEspeciaisCard
              key={d.id}
              data={d}
              onEditar={abrirEditar}
              onExcluir={excluir}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={abrirNova}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-2xl shadow-lg shadow-indigo-900/50 flex items-center justify-center transition-colors z-30"
      >
        +
      </button>

      <Modal
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        titulo={editandoId ? 'Editar data' : 'Nova data especial'}
      >
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Ex: Aniversário da Mãe"
              autoFocus
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Data *</label>
            <input
              type="date"
              value={form.data}
              onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tipo</label>
            <select
              value={form.tipo}
              onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aniversario">🎂 Aniversário</option>
              <option value="evento">📅 Evento</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-slate-200">Repetir todo ano</p>
              <p className="text-xs text-slate-500">Recorrência anual automática</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, recorrente: !f.recorrente }))}
              className={`w-12 h-6 rounded-full transition-colors ${form.recorrente ? 'bg-indigo-600' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.recorrente ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <button
            type="submit"
            disabled={salvando || !form.nome.trim() || !form.data}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {salvando ? 'Salvando...' : editandoId ? 'Salvar alterações' : 'Adicionar data'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
