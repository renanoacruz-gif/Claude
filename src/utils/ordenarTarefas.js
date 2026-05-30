import { parseISO, startOfDay, isBefore } from 'date-fns'

// Ordena tarefas por data limite — atrasadas primeiro, depois por data crescente
export function ordenarPorPrioridade(tarefas) {
  if (!tarefas || tarefas.length === 0) return []

  const hoje = startOfDay(new Date())

  return [...tarefas].sort((a, b) => {
    const dataA = a.data_limite ? startOfDay(parseISO(a.data_limite)) : null
    const dataB = b.data_limite ? startOfDay(parseISO(b.data_limite)) : null

    const atrasadaA = dataA ? isBefore(dataA, hoje) : false
    const atrasadaB = dataB ? isBefore(dataB, hoje) : false

    // Atrasadas vêm primeiro
    if (atrasadaA && !atrasadaB) return -1
    if (!atrasadaA && atrasadaB) return 1

    // Sem data vai para o final
    if (!dataA && dataB) return 1
    if (dataA && !dataB) return -1
    if (!dataA && !dataB) return 0

    // Ordena por data crescente
    return dataA - dataB
  })
}

// Filtra tarefas de hoje e atrasadas
export function tarefasDeHoje(tarefas) {
  if (!tarefas) return []
  const hoje = startOfDay(new Date())

  return tarefas.filter(t => {
    if (t.concluida) return false
    if (!t.data_limite) return false
    const data = startOfDay(parseISO(t.data_limite))
    return data <= hoje
  })
}
