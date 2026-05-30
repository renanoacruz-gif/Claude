import supabase from './supabase'

// Busca todas as datas especiais do usuário ordenadas por data
export async function buscarDatas(userId) {
  const { data, error } = await supabase
    .from('datas_especiais')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: true })

  if (error) throw error
  return data
}

// Cria uma nova data especial
export async function criarData(data) {
  const { data: resultado, error } = await supabase
    .from('datas_especiais')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return resultado
}

// Atualiza uma data especial existente
export async function atualizarData(id, updates) {
  const { data, error } = await supabase
    .from('datas_especiais')
    .update({ ...updates, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Exclui uma data especial
export async function excluirData(id) {
  const { error } = await supabase
    .from('datas_especiais')
    .delete()
    .eq('id', id)

  if (error) throw error
}
