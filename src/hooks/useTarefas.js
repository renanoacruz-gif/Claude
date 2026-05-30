import { useState, useEffect, useCallback } from 'react'
import {
  buscarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  concluirTarefa
} from '../services/tarefasService'

// Hook para gerenciar tarefas do usuário
export function useTarefas(userId) {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // Carrega tarefas do servidor
  const recarregar = useCallback(async () => {
    if (!userId) return

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

  // Carrega tarefas ao montar ou quando userId muda
  useEffect(() => {
    recarregar()
  }, [recarregar])

  // Cria nova tarefa
  async function criar(dadosTarefa) {
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

  // Atualiza uma tarefa existente
  async function atualizar(id, updates) {
    const atualizada = await atualizarTarefa(id, updates)
    setTarefas(prev => prev.map(t => t.id === id ? atualizada : t))
    return atualizada
  }

  // Exclui uma tarefa
  async function excluir(id) {
    await excluirTarefa(id)
    setTarefas(prev => prev.filter(t => t.id !== id))
  }

  // Alterna conclusão de tarefa
  async function concluir(id, concluida) {
    const atualizada = await concluirTarefa(id, concluida)
    setTarefas(prev => prev.map(t => t.id === id ? atualizada : t))
    return atualizada
  }

  return { tarefas, carregando, erro, criar, atualizar, excluir, concluir, recarregar }
}
