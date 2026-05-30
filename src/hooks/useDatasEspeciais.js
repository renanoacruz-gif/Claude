import { useState, useEffect, useCallback } from 'react'
import {
  buscarDatas,
  criarData,
  atualizarData,
  excluirData
} from '../services/datasEspeciaisService'
import { DATAS_DEMO } from '../services/demoData'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

function idDemo() {
  return 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
}

// Hook para gerenciar datas especiais do usuário
export function useDatasEspeciais(userId) {
  const [datas, setDatas] = useState(DEMO ? DATAS_DEMO : [])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    if (DEMO || !userId) return

    setCarregando(true)
    setErro(null)
    try {
      const dados = await buscarDatas(userId)
      setDatas(dados || [])
    } catch (e) {
      setErro(e.message)
      console.error('Erro ao carregar datas especiais:', e)
    } finally {
      setCarregando(false)
    }
  }, [userId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  async function criar(dadosData) {
    if (DEMO) {
      const nova = { ...dadosData, id: idDemo(), user_id: userId, criado_em: new Date().toISOString() }
      setDatas(prev => [...prev, nova])
      return nova
    }
    const novaData = {
      ...dadosData,
      user_id: userId,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }
    const criada = await criarData(novaData)
    setDatas(prev => [...prev, criada])
    return criada
  }

  async function atualizar(id, updates) {
    if (DEMO) {
      setDatas(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
      return
    }
    const atualizada = await atualizarData(id, updates)
    setDatas(prev => prev.map(d => d.id === id ? atualizada : d))
    return atualizada
  }

  async function excluir(id) {
    if (DEMO) { setDatas(prev => prev.filter(d => d.id !== id)); return }
    await excluirData(id)
    setDatas(prev => prev.filter(d => d.id !== id))
  }

  return { datas, carregando, erro, criar, atualizar, excluir, recarregar }
}
