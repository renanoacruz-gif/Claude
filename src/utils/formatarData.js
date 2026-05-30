import {
  format,
  isToday,
  isTomorrow,
  differenceInDays,
  parseISO,
  setYear,
  isAfter,
  startOfDay
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Formata data no padrão brasileiro DD/MM/YYYY
export function formatarData(data) {
  if (!data) return ''
  try {
    const dataObj = typeof data === 'string' ? parseISO(data) : data
    return format(dataObj, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return ''
  }
}

// Formata data de forma relativa em português
export function formatarDataRelativa(data) {
  if (!data) return ''
  try {
    const dataObj = typeof data === 'string' ? parseISO(data) : data
    const hoje = startOfDay(new Date())
    const dataAlvo = startOfDay(dataObj)
    const dias = differenceInDays(dataAlvo, hoje)

    if (isToday(dataAlvo)) return 'hoje'
    if (isTomorrow(dataAlvo)) return 'amanhã'
    if (dias < 0) return `há ${Math.abs(dias)} dia${Math.abs(dias) > 1 ? 's' : ''}`
    if (dias <= 7) return `em ${dias} dia${dias > 1 ? 's' : ''}`
    if (dias <= 30) return `em ${Math.ceil(dias / 7)} semana${Math.ceil(dias / 7) > 1 ? 's' : ''}`

    return formatarData(data)
  } catch {
    return ''
  }
}

// Calcula a próxima ocorrência de uma data (para eventos recorrentes anuais)
export function proximaOcorrencia(data, recorrente) {
  if (!data) return null
  try {
    const dataObj = typeof data === 'string' ? parseISO(data) : data
    const hoje = startOfDay(new Date())

    if (!recorrente) return dataObj

    // Tenta este ano
    const esteAno = setYear(dataObj, hoje.getFullYear())

    // Se ainda não passou este ano, retorna este ano
    if (isAfter(esteAno, hoje) || format(esteAno, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd')) {
      return esteAno
    }

    // Senão, retorna próximo ano
    return setYear(dataObj, hoje.getFullYear() + 1)
  } catch {
    return null
  }
}

// Calcula dias até a próxima ocorrência
export function diasAteProximaOcorrencia(data, recorrente) {
  const proxima = proximaOcorrencia(data, recorrente)
  if (!proxima) return null

  const hoje = startOfDay(new Date())
  return differenceInDays(startOfDay(proxima), hoje)
}
