import { createClient } from '@supabase/supabase-js'

// Configuração do cliente Supabase usando variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

export default supabase
