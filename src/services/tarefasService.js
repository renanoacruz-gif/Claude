import supabase from './supabase'

// Busca todas as tarefas do usuário ordenadas por data limite
export async function buscarTarefas(userId) {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .order('data_limite', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data
}

// Cria uma nova tarefa
export async function criarTarefa(tarefa) {
  const { data, error } = await supabase
    .from('tarefas')
    .insert([tarefa])
    .select()
    .single()

  if (error) throw error
  return data
}

// Atualiza campos de uma tarefa existente
export async function atualizarTarefa(id, updates) {
  const { data, error } = await supabase
    .from('tarefas')
    .update({ ...updates, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Exclui uma tarefa
export async function excluirTarefa(id) {
  const { error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Marca ou desmarca uma tarefa como concluída
export async function concluirTarefa(id, concluida) {
  const { data, error } = await supabase
    .from('tarefas')
    .update({
      concluida,
      concluida_em: concluida ? new Date().toISOString() : null,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
