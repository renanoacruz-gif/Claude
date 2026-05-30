import { useState, useEffect } from 'react'
import supabase from '../services/supabase'

// Hook de autenticação — gerencia sessão do usuário
export function useAuth() {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Busca sessão atual ao inicializar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCarregando(false)
    })

    // Escuta mudanças de autenticação em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        setUsuario(session?.user ?? null)
        setCarregando(false)
      }
    )

    // Cancela assinatura ao desmontar
    return () => subscription.unsubscribe()
  }, [])

  // Faz login com Google via OAuth
  async function entrarComGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  }

  // Faz logout
  async function sair() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { usuario, carregando, entrarComGoogle, sair }
}
