import { useState, useEffect } from 'react'
import supabase from '../services/supabase'
import { USUARIO_DEMO } from '../services/demoData'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

// Hook de autenticação — gerencia sessão do usuário
export function useAuth() {
  const [usuario, setUsuario] = useState(DEMO ? USUARIO_DEMO : null)
  const [carregando, setCarregando] = useState(!DEMO)

  useEffect(() => {
    if (DEMO) return

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

    return () => subscription.unsubscribe()
  }, [])

  async function entrarComGoogle() {
    if (DEMO) { setUsuario(USUARIO_DEMO); return }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) throw error
  }

  async function sair() {
    if (DEMO) { setUsuario(null); return }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { usuario, carregando, entrarComGoogle, sair }
}
