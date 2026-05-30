// Dados falsos para o modo demo — não usados em produção

const hoje = new Date()
const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1)
const ontem = new Date(hoje); ontem.setDate(hoje.getDate() - 1)
const semanaQue = new Date(hoje); semanaQue.setDate(hoje.getDate() + 7)

function fmt(d) {
  return d.toISOString().slice(0, 10)
}

export const USUARIO_DEMO = {
  id: 'demo-user-001',
  email: 'renan@demo.com',
  user_metadata: {
    full_name: 'Renan',
    avatar_url: null,
  }
}

export const TAREFAS_DEMO = [
  {
    id: '1',
    titulo: 'Revisar proposta do cliente',
    descricao: 'Verificar os termos e enviar feedback até o fim do dia',
    data_limite: fmt(hoje),
    concluida: false,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Pagar fatura do cartão',
    descricao: null,
    data_limite: fmt(hoje),
    concluida: false,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
  {
    id: '3',
    titulo: 'Comprar presente de aniversário',
    descricao: 'Aniversário da mamãe no sábado',
    data_limite: fmt(amanha),
    concluida: false,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
  {
    id: '4',
    titulo: 'Renovar academia',
    descricao: null,
    data_limite: fmt(semanaQue),
    concluida: false,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
  {
    id: '5',
    titulo: 'Responder e-mails atrasados',
    descricao: 'Clientes da semana passada',
    data_limite: fmt(ontem),
    concluida: false,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
  {
    id: '6',
    titulo: 'Ler livro de hábitos',
    descricao: 'Capítulo 3 — O Loop do Hábito',
    data_limite: fmt(semanaQue),
    concluida: true,
    user_id: USUARIO_DEMO.id,
    criado_em: new Date().toISOString(),
  },
]

const anivMae = new Date(hoje); anivMae.setDate(hoje.getDate() + 4)
const anivAmigo = new Date(hoje); anivAmigo.setDate(hoje.getDate() + 18)
const casamento = new Date(hoje); casamento.setDate(hoje.getDate() + 45)
const anivIrmao = new Date(hoje); anivIrmao.setDate(hoje.getDate() + 2)

export const DATAS_DEMO = [
  {
    id: '1',
    nome: 'Aniversário da Mamãe',
    data: fmt(anivMae),
    tipo: 'aniversario',
    recorrente: true,
    user_id: USUARIO_DEMO.id,
  },
  {
    id: '2',
    nome: 'Aniversário do João',
    data: fmt(anivAmigo),
    tipo: 'aniversario',
    recorrente: true,
    user_id: USUARIO_DEMO.id,
  },
  {
    id: '3',
    nome: 'Casamento da Prima Carol',
    data: fmt(casamento),
    tipo: 'evento',
    recorrente: false,
    user_id: USUARIO_DEMO.id,
  },
  {
    id: '4',
    nome: 'Aniversário do Irmão',
    data: fmt(anivIrmao),
    tipo: 'aniversario',
    recorrente: true,
    user_id: USUARIO_DEMO.id,
  },
]
