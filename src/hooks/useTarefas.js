import { useState, useEffect, useCallback } from 'react'
import {
  buscarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  concluirTarefa
} from '../services/tarefasService'
import { TAREFAS_DEMO } from '../services/demoData'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

// Gera ID único simples para o modo demo
function idDemo() {
  return 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
}

// Hook para gerenciar tarefas do usuário
export function useTarefas(userId) {
  const [tarefas, setTarefas] = useState(DEMO ? TAREFAS_DEMO : [])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    if (DEMO || !userId) return

    setCarregando(true)
    setErro(null)
    try {
      const dados = await buscarTarefas(userId)
      setTarefas(dados || [])
    } catch (e) {
      setErro(e.message)
      console.error('Erro ao carregar tarefas:', e)
    } finally {
      setCarregando(false)
    }
  }, [userId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function criar(dadosTarefa) {
    if (DEMO) {
      const nova = { ...dadosTarefa, id: idDemo(), user_id: userId, concluida: false, criado_em: new Date().toISOString() }
      setTarefas(prev => [...prev, nova])
      return nova
    }
    const novaTarefa = {
      ...dadosTarefa,
      user_id: userId,
      concluida: false,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }
    const criada = await criarTarefa(novaTarefa)
    setTarefas(prev => [...prev, criada])
    return criada
  }

  async function atualizar(id, updates) {
    if (DEMO) {
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
      return
    }
    const atualizada = await atualizarTarefa(id, updates)
    setTarefas(prev => prev.map(t => t.id === id ? atualizada : t))
    return atualizada
  }

  async function excluir(id) {
    if (DEMO) { setTarefas(prev => prev.filter(t => t.id !== id)); return }
    await excluirTarefa(id)
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  async function concluir(id, concluida) {
    if (DEMO) {
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida } : t))
      return
    }
    const atualizada = await concluirTarefa(id, concluida)
    setTarefas(prev => prev.map(t => t.id === id ? atualizada : t))
    return atualizada
  }

  return { tarefas, carregando, erro, criar, atualizar, excluir, concluir, recarregar }
}
