import { useState, useEffect, useCallback } from 'react'
import {
  buscarDatas,
  criarData,
  atualizarData,
  excluirData
} from '../services/datasEspeciaisService'

// Hook para gerenciar datas especiais do usuário
export function useDatasEspeciais(userId) {
  const [datas, setDatas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // Carrega datas do servidor
  const recarregar = useCallback(async () => {
    if (!userId) return

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

  // Carrega datas ao montar ou quando userId muda
  useEffect(() => {
    recarregar()
  }, [recarregar])

  // Cria nova data especial
  async function criar(dadosData) {
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

  // Atualiza uma data especial existente
  async function atualizar(id, updates) {
    const atualizada = await atualizarData(id, updates)
    setDatas(prev => prev.map(d => d.id === id ? atualizada : d))
    return atualizada
  }

  // Exclui uma data especial
  async function excluir(id) {
    await excluirData(id)
    setDatas(prev => prev.filter(d => d.id !== id))
  }

  return { datas, carregando, erro, criar, atualizar, excluir, recarregar }
}
